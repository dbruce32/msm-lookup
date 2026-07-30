"use client";

import { useState, useMemo } from "react";
import type { Monster } from "@/lib/types";
import { IslandIcon } from "./IslandIcon";
import { Collapsible } from "./Collapsible";

interface BreedingPlannerProps {
  monster: Monster;
  allMonsters: Monster[];
}

interface BreedOption {
  monster: string;
  island: string;
  timeMinutes: number;
  timeLabel: string;
  enhancedMinutes: number;
  enhancedLabel: string;
}

interface ScheduledTask {
  monster: string;
  start: number;
  end: number;
  structure: number;
  timeLabel: string;
}

interface IslandSchedule {
  island: string;
  tasks: ScheduledTask[];
  totalTime: number;
}

function parseTime(time: string): number {
  let minutes = 0;
  const dayMatch = time.match(/(\d+)d/);
  const hourMatch = time.match(/(\d+)h/);
  const minMatch = time.match(/(\d+)m(?!s)/);
  const secMatch = time.match(/(\d+)s/);
  if (dayMatch) minutes += parseInt(dayMatch[1]) * 24 * 60;
  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
  if (minMatch) minutes += parseInt(minMatch[1]);
  if (secMatch) minutes += Math.ceil(parseInt(secMatch[1]) / 60);
  return minutes;
}

function formatMinutes(mins: number): string {
  const days = Math.floor(mins / (24 * 60));
  const hours = Math.floor((mins % (24 * 60)) / 60);
  const m = mins % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(" ") || "0m";
}

/**
 * For a given monster, find ALL islands it can be bred on with their times.
 */
function getAllBreedingOptions(
  monsterName: string,
  allMonsters: Monster[]
): BreedOption[] {
  const mon = allMonsters.find((m) => m.name === monsterName);
  if (!mon) return [];

  const options: BreedOption[] = [];
  for (const [island, breeding] of Object.entries(mon.breeding)) {
    if (breeding.common && breeding.common.time) {
      const time = parseTime(breeding.common.time);
      const enhancedTime = breeding.common.enhanced_time
        ? parseTime(breeding.common.enhanced_time)
        : time;
      options.push({
        monster: monsterName,
        island,
        timeMinutes: time,
        timeLabel: breeding.common.time,
        enhancedMinutes: enhancedTime,
        enhancedLabel: breeding.common.enhanced_time || breeding.common.time,
      });
    }
  }
  return options;
}

/**
 * Optimally distribute breeds across islands to minimize total time.
 * 
 * Strategy: For each breed (expanded by quantity), assign it to whichever
 * island+structure combination finishes earliest after adding this breed.
 * This greedily balances load across all available islands.
 */
function optimizeSchedule(
  requirements: { monster: string; quantity: number }[],
  allMonsters: Monster[],
  structures: number,
  useEnhanced: boolean
): IslandSchedule[] {
  // Track free-at time for each island's structures
  // Key: island name, Value: array of free-at times (one per structure)
  const islandStructures = new Map<string, number[]>();

  // Track scheduled tasks per island
  const islandTasks = new Map<string, ScheduledTask[]>();

  // Collect all individual breeds, sorted longest first for better packing
  const breeds: { monster: string; options: BreedOption[] }[] = [];
  for (const req of requirements) {
    const options = getAllBreedingOptions(req.monster, allMonsters);
    if (options.length > 0) {
      for (let i = 0; i < req.quantity; i++) {
        breeds.push({ monster: req.monster, options });
      }
    }
  }

  // Sort by minimum available time descending (longest breeds first)
  breeds.sort((a, b) => {
    const aMin = Math.min(...a.options.map((o) => useEnhanced ? o.enhancedMinutes : o.timeMinutes));
    const bMin = Math.min(...b.options.map((o) => useEnhanced ? o.enhancedMinutes : o.timeMinutes));
    return bMin - aMin;
  });

  for (const breed of breeds) {
    let bestIsland = "";
    let bestStructure = 0;
    let bestEnd = Infinity;
    let bestOption: BreedOption | null = null;

    for (const option of breed.options) {
      const duration = useEnhanced ? option.enhancedMinutes : option.timeMinutes;

      // Initialize island structures if not seen yet
      if (!islandStructures.has(option.island)) {
        islandStructures.set(option.island, new Array(structures).fill(0));
        islandTasks.set(option.island, []);
      }

      const freeAts = islandStructures.get(option.island)!;

      // Find the earliest-free structure on this island
      for (let s = 0; s < structures; s++) {
        const end = freeAts[s] + duration;
        if (end < bestEnd) {
          bestEnd = end;
          bestIsland = option.island;
          bestStructure = s;
          bestOption = option;
        }
      }
    }

    if (bestOption) {
      const freeAts = islandStructures.get(bestIsland)!;
      const start = freeAts[bestStructure];
      freeAts[bestStructure] = bestEnd;

      islandTasks.get(bestIsland)!.push({
        monster: breed.monster,
        start,
        end: bestEnd,
        structure: bestStructure,
        timeLabel: useEnhanced ? bestOption.enhancedLabel : bestOption.timeLabel,
      });
    }
  }

  // Build island schedules
  const schedules: IslandSchedule[] = [];
  for (const [island, tasks] of Array.from(islandTasks.entries())) {
    if (tasks.length > 0) {
      const totalTime = Math.max(...tasks.map((t) => t.end), 0);
      schedules.push({ island, tasks, totalTime });
    }
  }

  // Sort by total time descending (bottleneck first)
  schedules.sort((a, b) => b.totalTime - a.totalTime);
  return schedules;
}

const COLORS = [
  "bg-blue-200 border-blue-400 text-blue-900",
  "bg-emerald-200 border-emerald-400 text-emerald-900",
  "bg-amber-200 border-amber-400 text-amber-900",
  "bg-purple-200 border-purple-400 text-purple-900",
  "bg-rose-200 border-rose-400 text-rose-900",
  "bg-cyan-200 border-cyan-400 text-cyan-900",
  "bg-orange-200 border-orange-400 text-orange-900",
  "bg-indigo-200 border-indigo-400 text-indigo-900",
  "bg-teal-200 border-teal-400 text-teal-900",
  "bg-pink-200 border-pink-400 text-pink-900",
];

export function BreedingPlanner({ monster, allMonsters }: BreedingPlannerProps) {
  const [structures, setStructures] = useState(1);
  const [useEnhanced, setUseEnhanced] = useState(false);

  const eggs = monster.eggs;

  const islandSchedules = useMemo(() => {
    if (!eggs || !eggs.requirements) return [];
    return optimizeSchedule(eggs.requirements, allMonsters, structures, useEnhanced);
  }, [eggs, allMonsters, structures, useEnhanced]);

  const globalMaxTime = useMemo(
    () => Math.max(...islandSchedules.map((s) => s.totalTime), 0),
    [islandSchedules]
  );

  const totalBreeds = useMemo(
    () => islandSchedules.reduce((sum, s) => sum + s.tasks.length, 0),
    [islandSchedules]
  );

  // Color map by monster name
  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    const allNames = new Set<string>();
    for (const s of islandSchedules) {
      for (const t of s.tasks) {
        allNames.add(t.monster);
      }
    }
    Array.from(allNames).forEach((name, i) => {
      map.set(name, COLORS[i % COLORS.length]);
    });
    return map;
  }, [islandSchedules]);

  if (!eggs || !eggs.requirements || islandSchedules.length === 0) return null;

  return (
    <Collapsible title="📅 Breeding Planner" defaultOpen={false}>
      <div className="bg-white p-4 space-y-4">
        <p className="text-xs text-gray-500">
          Optimized breeding schedule distributing monsters across all available islands.
          Hover over bars for details.
        </p>
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <span>Structures per island:</span>
            <select
              value={structures}
              onChange={(e) => setStructures(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </label>
          <button
            onClick={() => setUseEnhanced((prev) => !prev)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
              useEnhanced
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
            }`}
          >
            ⚡ Enhanced
          </button>
          <div className="ml-auto text-sm text-gray-500 text-right">
            <div>{totalBreeds} breeds across {islandSchedules.length} islands</div>
            <div>
              Total: <span className="font-semibold text-gray-900">{formatMinutes(globalMaxTime)}</span>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            {/* Time markers */}
            <div className="relative h-4 mb-2 ml-32">
              {Array.from({ length: 5 }).map((_, i) => {
                const time = Math.round((globalMaxTime * i) / 4);
                const pct = (i / 4) * 100;
                return (
                  <span
                    key={i}
                    className="absolute text-[10px] text-gray-400 -translate-x-1/2"
                    style={{ left: `${pct}%` }}
                  >
                    {formatMinutes(time)}
                  </span>
                );
              })}
            </div>

            {/* Rows per island */}
            {islandSchedules.map(({ island, tasks }) => (
              <div key={island} className="mb-2">
                {Array.from({ length: structures }).map((_, structIdx) => {
                  const structTasks = tasks.filter((t) => t.structure === structIdx);
                  return (
                    <div key={structIdx} className="flex items-center mb-0.5">
                      <div className="w-32 flex-shrink-0 flex items-center gap-1.5 pr-2">
                        {structIdx === 0 && (
                          <>
                            <IslandIcon island={island} size={20} />
                            <span className="text-xs text-gray-600 truncate">{island}</span>
                          </>
                        )}
                      </div>
                      <div className="flex-1 relative h-7 bg-gray-50 rounded border border-gray-100">
                        {structTasks.map((task, i) => {
                          const left = globalMaxTime > 0 ? (task.start / globalMaxTime) * 100 : 0;
                          const width = globalMaxTime > 0 ? ((task.end - task.start) / globalMaxTime) * 100 : 0;
                          const color = colorMap.get(task.monster) || COLORS[0];
                          return (
                            <div
                              key={`${task.monster}-${task.start}-${i}`}
                              className={`absolute top-0.5 bottom-0.5 rounded border text-[10px] flex items-center px-1 overflow-hidden whitespace-nowrap ${color}`}
                              style={{ left: `${left}%`, width: `${Math.max(width, 0.5)}%` }}
                              title={`${task.monster} (${task.timeLabel})`}
                            >
                              <span className="truncate">{task.monster}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {Array.from(colorMap.entries()).map(([name, color]) => (
            <span key={name} className={`text-[11px] px-2 py-0.5 rounded border ${color}`}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </Collapsible>
  );
}
