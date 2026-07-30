"use client";

import { useState, useMemo } from "react";
import type { Monster } from "@/lib/types";

interface BreedingPlannerProps {
  monster: Monster;
  allMonsters: Monster[];
}

interface BreedingTask {
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
  island: string;
  start: number;
  end: number;
  slot: number;
  timeLabel: string;
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

function scheduleBreeding(tasks: BreedingTask[], slots: number, useEnhanced: boolean): ScheduledTask[] {
  const scheduled: ScheduledTask[] = [];
  const slotFreeAt = new Array(slots).fill(0);

  const expanded: BreedingTask[] = [];
  for (const task of tasks) {
    for (let i = 0; i < task.quantity; i++) {
      expanded.push(task);
    }
  }
  expanded.sort((a, b) => {
    const aTime = useEnhanced ? a.enhancedMinutes : a.timeMinutes;
    const bTime = useEnhanced ? b.enhancedMinutes : b.timeMinutes;
    return bTime - aTime;
  });

  for (const task of expanded) {
    let minSlot = 0;
    for (let i = 1; i < slots; i++) {
      if (slotFreeAt[i] < slotFreeAt[minSlot]) minSlot = i;
    }
    const start = slotFreeAt[minSlot];
    const duration = useEnhanced ? task.enhancedMinutes : task.timeMinutes;
    const end = start + duration;
    slotFreeAt[minSlot] = end;

    scheduled.push({
      monster: task.monster,
      island: task.island,
      start,
      end,
      slot: minSlot,
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
];

export function BreedingPlanner({ monster, allMonsters }: BreedingPlannerProps) {
  const [slots, setSlots] = useState(2);
  const [useEnhanced, setUseEnhanced] = useState(false);

  const eggs = monster.eggs;

  const tasks = useMemo(() => {
    if (!eggs || !eggs.requirements) return [];
    const result: BreedingTask[] = [];
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

  const scheduled = useMemo(
    () => scheduleBreeding(tasks, slots, useEnhanced),
    [tasks, slots, useEnhanced]
  );

  const totalTime = useMemo(
    () => Math.max(...scheduled.map((t) => t.end), 0),
    [scheduled]
  );

  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    const uniqueMonsters = Array.from(new Set(tasks.map((t) => t.monster)));
    uniqueMonsters.forEach((name, i) => {
      map.set(name, COLORS[i % COLORS.length]);
    });
    return map;
  }, [tasks]);

  if (!eggs || !eggs.requirements || tasks.length === 0) return null;

  const totalBreeds = scheduled.length;

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="px-4 py-2.5 bg-slate-200 border-b border-slate-300">
        <h3 className="font-semibold text-slate-700 text-sm">📅 Breeding Planner</h3>
      </div>
      <div className="bg-white p-4 space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <span>Breeding structures:</span>
            <input
              type="number"
              min={1}
              max={10}
              value={slots}
              onChange={(e) => setSlots(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
            />
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
            <div>{totalBreeds} breeds</div>
            <div>
              Total: <span className="font-semibold text-gray-900">{formatMinutes(totalTime)}</span>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            {/* Time markers */}
            <div className="relative h-4 mb-2 ml-16">
              {Array.from({ length: 5 }).map((_, i) => {
                const time = Math.round((totalTime * i) / 4);
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

            {/* Rows per slot */}
            {Array.from({ length: slots }).map((_, slotIdx) => {
              const slotTasks = scheduled.filter((t) => t.slot === slotIdx);
              return (
                <div key={slotIdx} className="flex items-center mb-1.5">
                  <span className="w-16 text-xs text-gray-500 flex-shrink-0">
                    Slot {slotIdx + 1}
                  </span>
                  <div className="flex-1 relative h-8 bg-gray-50 rounded border border-gray-100">
                    {slotTasks.map((task, i) => {
                      const left = totalTime > 0 ? (task.start / totalTime) * 100 : 0;
                      const width = totalTime > 0 ? ((task.end - task.start) / totalTime) * 100 : 0;
                      const color = colorMap.get(task.monster) || COLORS[0];
                      return (
                        <div
                          key={`${task.monster}-${task.start}-${i}`}
                          className={`absolute top-0.5 bottom-0.5 rounded border text-[10px] flex items-center px-1 overflow-hidden whitespace-nowrap ${color}`}
                          style={{ left: `${left}%`, width: `${Math.max(width, 0.5)}%` }}
                          title={`${task.monster} (${task.timeLabel}) on ${task.island}`}
                        >
                          {width > 10 && <span className="truncate">{task.monster}</span>}
                        </div>
                      );
                    })}
                  </div>
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
