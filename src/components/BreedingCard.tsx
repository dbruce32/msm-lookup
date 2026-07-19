"use client";

import type { IslandBreeding, BreedingEntry } from "@/lib/types";

interface BreedingCardProps {
  island: string;
  breeding: IslandBreeding;
}

const LABEL_STYLES: Record<string, string> = {
  Common: "bg-gray-100 text-gray-600 border border-gray-200",
  Rare: "bg-blue-50 text-blue-700 border border-blue-200",
  Epic: "bg-amber-50 text-amber-700 border border-amber-300 font-bold shadow-[0_0_6px_rgba(245,158,11,0.2)]",
};

function BreedingRow({
  label,
  entry,
}: {
  label: string;
  entry: BreedingEntry;
}) {
  const labelStyle = LABEL_STYLES[label] ?? LABEL_STYLES.Common;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 px-4">
      <span
        className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full w-fit ${labelStyle}`}
      >
        {label}
      </span>
      <div className="flex-1">
        <span className="font-medium text-gray-900">
          {entry.pair[0]}
        </span>
        <span className="text-gray-300 mx-1.5">+</span>
        <span className="font-medium text-gray-900">
          {entry.pair[1]}
        </span>
      </div>
      <div className="text-sm flex gap-3">
        <span className="text-gray-500">⏱ {entry.time}</span>
        <span className="text-emerald-600 font-medium">⚡ {entry.enhanced_time}</span>
      </div>
    </div>
  );
}

export function BreedingCard({ island, breeding }: BreedingCardProps) {
  const entries: { label: string; entry: BreedingEntry }[] = [];

  if (breeding.common) entries.push({ label: "Common", entry: breeding.common });
  if (breeding.rare) entries.push({ label: "Rare", entry: breeding.rare });
  if (breeding.epic) entries.push({ label: "Epic", entry: breeding.epic });

  if (entries.length === 0) return null;

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="px-4 py-2.5 bg-slate-200 border-b border-slate-300">
        <h4 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
          <span>🏝️</span>
          {island}
        </h4>
      </div>
      <div className="bg-white divide-y divide-gray-100">
        {entries.map(({ label, entry }) => (
          <BreedingRow key={label} label={label} entry={entry} />
        ))}
      </div>
    </div>
  );
}
