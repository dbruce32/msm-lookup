"use client";

import type { IslandBreeding, BreedingEntry } from "@/lib/types";

interface BreedingCardProps {
  island: string;
  breeding: IslandBreeding;
}

function BreedingRow({
  label,
  entry,
}: {
  label: string;
  entry: BreedingEntry;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 w-16">
        {label}
      </span>
      <div className="flex-1">
        <span className="font-medium">
          {entry.pair[0]} + {entry.pair[1]}
        </span>
      </div>
      <div className="text-sm text-gray-600 flex gap-3">
        <span>⏱ {entry.time}</span>
        <span className="text-green-700">⚡ {entry.enhanced_time}</span>
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
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <h4 className="font-semibold text-gray-800 mb-2">{island}</h4>
      <div className="divide-y divide-gray-100">
        {entries.map(({ label, entry }) => (
          <BreedingRow key={label} label={label} entry={entry} />
        ))}
      </div>
    </div>
  );
}
