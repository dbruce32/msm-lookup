"use client";

import { useMemo } from "react";
import type { Monster } from "@/lib/types";
import { ElementIcon } from "./ElementIcon";
import { CurrencyValue, CurrencyIcon } from "./CurrencyIcon";
import { GridIcon } from "./GridIcon";
import { EggIcon, TimeIcon } from "./Icons";
import { IslandIcon } from "./IslandIcon";
import { BreedingPlanner } from "./BreedingPlanner";
import { Collapsible } from "./Collapsible";

interface EggDetailProps {
  monster: Monster;
  onBack: () => void;
  allMonsters: Monster[];
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{children}</span>
    </div>
  );
}

const CLASS_BADGES: Record<string, string> = {
  Wublin: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Rare Wublin": "bg-blue-100 text-blue-800 border-blue-200",
  "Epic Wublin": "bg-amber-100 text-amber-800 border-amber-200",
  Celestial: "bg-violet-100 text-violet-800 border-violet-200",
};

export function EggDetail({ monster, onBack, allMonsters }: EggDetailProps) {
  // Build a lookup: monster name -> islands it can be bred on
  const monsterIslands = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const m of allMonsters) {
      const islands = Object.keys(m.breeding);
      if (islands.length > 0) {
        map.set(m.name, islands);
      }
    }
    return map;
  }, [allMonsters]);

  const eggs = monster.eggs;
  if (!eggs) return null;

  const isYoungCelestial =
    monster.class === "Celestial" && !monster.name.startsWith("Adult");
  const isAdultCelestial =
    monster.class === "Celestial" && monster.name.startsWith("Adult");

  const badgeColor =
    CLASS_BADGES[monster.class] ?? "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none
                   focus:underline transition-colors"
      >
        ← Back to results
      </button>

      <div className="rounded-lg p-5 bg-slate-200 shadow-sm border border-slate-300 relative">
        <a
          href={`https://mysingingmonsters.fandom.com/wiki/${encodeURIComponent(monster.name.replace(/ /g, "_"))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 text-sm text-indigo-600 hover:text-indigo-800 underline transition-colors"
        >
          View on Wiki ↗
        </a>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-slate-900">{monster.name}</h2>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium border ${badgeColor}`}
          >
            {monster.class}
          </span>
        </div>
        {monster.associated_element && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-sm text-slate-500">Calendar Element:</span>
            <ElementIcon element={monster.associated_element} size={24} />
          </div>
        )}
        {(monster.class === "Wublin" ||
          monster.class === "Rare Wublin" ||
          monster.class === "Epic Wublin") && (
          <div className="mt-2 flex items-center gap-1.5">
            <ElementIcon element="Electricity" size={24} />
          </div>
        )}
      </div>

      {/* Stats */}
      <Collapsible title="Egg Info">
        <div className="bg-white px-4 py-2 divide-y divide-gray-100">
          {eggs.size && (
            <InfoRow label="Size">
              <span className="inline-flex items-center gap-1">
                {eggs.size}
                <GridIcon size={eggs.size} iconSize={20} />
              </span>
            </InfoRow>
          )}
          {eggs.cost && (
            <InfoRow label="Cost">
              <CurrencyValue value={eggs.cost} />
            </InfoRow>
          )}
          {eggs.ascension_cost && (
            <InfoRow label="Ascension Cost">
              <CurrencyValue value={eggs.ascension_cost} />
            </InfoRow>
          )}
          {eggs.discounted_cost && (
            <InfoRow label="Discounted Cost">
              <CurrencyValue value={eggs.discounted_cost} />
            </InfoRow>
          )}
          {eggs.time && (
            <InfoRow label="Time">
              <span className="inline-flex items-center gap-1">
                {eggs.time}
                <TimeIcon size={18} />
              </span>
            </InfoRow>
          )}
          {eggs.fill_price && (
            <InfoRow label="Fill Price">
              <CurrencyValue value={eggs.fill_price} />
            </InfoRow>
          )}
          {eggs.wildcards != null && (
            <InfoRow label="Wildcards">
              <span className="inline-flex items-center gap-1">
                {String(eggs.wildcards)}
                <CurrencyIcon currency="Wildcards" size={18} />
              </span>
            </InfoRow>
          )}
          {eggs.total != null && (
            <InfoRow label="Total Eggs">
              <span className="inline-flex items-center gap-1">
                {String(eggs.total)}
                <EggIcon size={18} />
              </span>
            </InfoRow>
          )}
          {eggs.availability && (
            <InfoRow label="Availability">{eggs.availability}</InfoRow>
          )}
          {eggs.sells_for && (
            <InfoRow label="Sells For">
              <CurrencyValue value={eggs.sells_for} />
            </InfoRow>
          )}
          {eggs.awakened_sells_for && (
            <InfoRow label="Awakened Sells For">
              <CurrencyValue value={eggs.awakened_sells_for} />
            </InfoRow>
          )}
          {eggs.release_date && (
            <InfoRow label="Release Date">{eggs.release_date}</InfoRow>
          )}
        </div>
      </Collapsible>

      {/* Requirements */}
      {eggs.requirements && eggs.requirements.length > 0 && (
        <Collapsible title={`🥚 Egg Requirements (${eggs.requirements.length} monsters)`}>
          <div className="bg-white divide-y divide-gray-100">
            {eggs.requirements.map((req) => (
              <div
                key={req.monster}
                className="px-4 py-2.5"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{req.monster}</span>
                  <span className="text-sm bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium">
                    ×{req.quantity}
                  </span>
                </div>
                {monsterIslands.has(req.monster) && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                    {monsterIslands.get(req.monster)!.map((island) => (
                      <IslandIcon key={island} island={island} size={20} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Context info for celestials */}
      {isYoungCelestial && (
        <p className="text-xs text-gray-400 text-center">
          Young Celestial — fill eggs to awaken
        </p>
      )}
      {isAdultCelestial && (
        <p className="text-xs text-gray-400 text-center">
          Adult Celestial — available during specific months
        </p>
      )}

      {/* Breeding Planner */}
      <BreedingPlanner monster={monster} allMonsters={allMonsters} />
    </div>
  );
}
