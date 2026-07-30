"use client";

import { useState, useMemo } from "react";
import type { Monster } from "@/lib/types";
import { IslandIcon } from "./IslandIcon";

interface BreedingPlannerProps {
  monster: Monster;
  allMonsters: Monster[];
}

interface BreedingAssignment {
  monster: string;
  quantity: number;
  timeMinutes: number;
  timeLabel: string;
  enhancedMinutes: number;
  enhancedLabel: string;
  island: string;
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
 * For a given monster, find the fastest common breeding time and return its island.
 */
function getFastestBreeding(
  monsterName: string,
  allMonsters: Monster[],
  useEnhanced: boolean
): { time: number; enhancedTime: number; timeLabel: string; enhancedLabel: string; island: string } | null {
  const mon = allMonsters.find((m) => m.name === monsterName);
  if (!mon) return null;

  let best: { time: number; enhancedTime: number; timeLabel: string; enhancedLabel: string; island: string } | null = null;

  for (const [island, breeding] of Object.entries(mon.breeding)) {
    if (breeding.common && breeding.common.time) {
      const time = parseTime(breeding.common.time);
      const enhancedTime = breeding.common.enhanced_time
        ? parseTime(breeding.common.enhanced_time)
        : time;
      const compareTime = useEnhanced ? enhancedTime : time;
      if (!best || compareTime < (useEnhanced ? best.enhancedTime : best.time)) {
        best = {
          time,
          enhancedTime,
          timeLabel: breeding.common.time,
          enhancedLabel: breeding.common.enhanced_time || breeding.common.time,
          island,
        };
      }
    }
  }

  return best;
}

/**
 * Schedule breeds on a single island with N structures (parallel slots).
 */
function scheduleIsland(
  assignments: BreedingAssignment[],
  structures: number,
  useEnhanced: boolean
): ScheduledTask[] {
  const scheduled: ScheduledTask[] = [];
  const structureFreeAt = new Array(structures).fill(0);

  // Expand by quantity, sort longest first
  const expanded: BreedingAssignment[] = [];
  for (const a of assignments) {
    for (let i = 0; i < a.quantity; i++) {
      expanded.push(a);
    }
  }
  expanded.sort((a, b) => {
    const aTime = useEnhanced ? a.enhancedMinutes : a.timeMinutes;
    const bTime = useEnhanced ? b.enhancedMinutes : b.timeMinutes;
    return bTime - aTime;
  });

  for (const task of expanded) {
    // Find structure with earliest free time
    let minStruct = 0;
    for (let i = 1; i < structures; i++) {
      if (structureFreeAt[i] < structureFreeAt[minStruct]) minStruct = i;
    }
    const start = structureFreeAt[minStruct];
    const duration = useEnhanced ? task.enhancedMinutes : task.timeMinutes;
    const end = start + duration;
    structureFreeAt[minStruct] = end;

    scheduled.push({
      monster: task.monster,
      start,
      end,
      structure: minStruct,
      timeLabel: useEnhanced ? task.enhancedLabel : task.timeLabel,
    });
  }

  return scheduled;
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

  // Assign each requirement to its fastest island
  const assignments = useMemo(() => {
    if (!eggs || !eggs.requirements) return [];
    const result: BreedingAssignment[] = [];
    for (const req of eggs.requirements) {
      const breeding = getFastestBreeding(req.monster, allMonsters, useEnhanced);
      if (breeding) {
        result.push({
          monster: req.monster,
          quantity: req.quantity,
          timeMinutes: breeding.time,
          timeLabel: breeding.timeLabel,
          enhancedMinutes: breeding.enhancedTime,
          enhancedLabel: breeding.enhancedLabel,
          island: breeding.island,
        });
      }
    }
    return result;
  }, [eggs, allMonsters, useEnhanced]);

  // Group assignments by island
  const islandGroups = useMemo(() => {
    const map = new Map<string, BreedingAssignment[]>();
    for (const a of assignments) {
      const group = map.get(a.island) || [];
      group.push(a);
      map.set(a.island, group);
    }
    return map;
  }, [assignments]);

  // Schedule each island independently
  const islandSchedules = useMemo((): IslandSchedule[] => {
    const schedules: IslandSchedule[] = [];
    for (const [island, group] of Array.from(islandGroups.entries())) {
      const tasks = scheduleIsland(group, structures, useEnhanced);
      const totalTime = Math.max(...tasks.map((t) => t.end), 0);
      schedules.push({ island, tasks, totalTime });
    }
    // Sort by total time descending (longest island first)
    schedules.sort((a, b) => b.totalTime - a.totalTime);
    return schedules;
  }, [islandGroups, structures, useEnhanced]);

  // Global max time (the bottleneck island determines total)
  const globalMaxTime = useMemo(
    () => Math.max(...islandSchedules.map((s) => s.totalTime), 0),
    [islandSchedules]
  );

  // Color map by monster name
  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    const uniqueMonsters = Array.from(new Set(assignments.map((a) => a.monster)));
    uniqueMonsters.forEach((name, i) => {
      map.set(name, COLORS[i % COLORS.length]);
    });
    return map;
  }, [assignments]);

  if (!eggs || !eggs.requirements || assignments.length === 0) return null;

  const totalBreeds = assignments.reduce((sum, a) => sum + a.quantity, 0);

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="px-4 py-2.5 bg-slate-200 border-b border-slate-300">
        <h3 className="font-semibold text-slate-700 text-sm">📅 Breeding Planner</h3>
      </div>
      <div className="bg-white p-4 space-y-4">
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
            {islandSchedules.map(({ island, tasks }) => {
              const rowCount = structures;
              return (
                <div key={island} className="mb-2">
                  {Array.from({ length: rowCount }).map((_, structIdx) => {
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
                                {width > 8 && <span className="truncate">{task.monster}</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
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
    </div>
  );
}
