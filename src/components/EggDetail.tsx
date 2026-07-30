"use client";

import type { Monster } from "@/lib/types";
import { ElementIcon } from "./ElementIcon";

interface EggDetailProps {
  monster: Monster;
  onBack: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

const CLASS_BADGES: Record<string, string> = {
  Wublin: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Rare Wublin": "bg-blue-100 text-blue-800 border-blue-200",
  "Epic Wublin": "bg-amber-100 text-amber-800 border-amber-200",
  Celestial: "bg-violet-100 text-violet-800 border-violet-200",
};

export function EggDetail({ monster, onBack }: EggDetailProps) {
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

      <div className="rounded-lg p-5 bg-slate-200 shadow-sm border border-slate-300">
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
            <span className="text-sm text-slate-500">Element:</span>
            <ElementIcon element={monster.associated_element} size={24} />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <div className="px-4 py-2.5 bg-slate-200 border-b border-slate-300">
          <h3 className="font-semibold text-slate-700 text-sm">Egg Info</h3>
        </div>
        <div className="bg-white px-4 py-2 divide-y divide-gray-100">
          {eggs.size && <InfoRow label="Size" value={eggs.size} />}
          {eggs.cost && <InfoRow label="Cost" value={eggs.cost} />}
          {eggs.ascension_cost && (
            <InfoRow label="Ascension Cost" value={eggs.ascension_cost} />
          )}
          {eggs.discounted_cost && (
            <InfoRow label="Discounted Cost" value={eggs.discounted_cost} />
          )}
          {eggs.time && <InfoRow label="Time" value={eggs.time} />}
          {eggs.fill_price && (
            <InfoRow label="Fill Price" value={eggs.fill_price} />
          )}
          {eggs.wildcards != null && (
            <InfoRow label="Wildcards" value={String(eggs.wildcards)} />
          )}
          {eggs.total != null && (
            <InfoRow label="Total Eggs" value={String(eggs.total)} />
          )}
          {eggs.availability && (
            <InfoRow label="Availability" value={eggs.availability} />
          )}
          {eggs.sells_for && (
            <InfoRow label="Sells For" value={eggs.sells_for} />
          )}
          {eggs.awakened_sells_for && (
            <InfoRow label="Awakened Sells For" value={eggs.awakened_sells_for} />
          )}
          {eggs.release_date && (
            <InfoRow label="Release Date" value={eggs.release_date} />
          )}
        </div>
      </div>

      {/* Requirements */}
      {eggs.requirements && eggs.requirements.length > 0 && (
        <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <div className="px-4 py-2.5 bg-slate-200 border-b border-slate-300">
            <h3 className="font-semibold text-slate-700 text-sm">
              🥚 Egg Requirements ({eggs.requirements.length} monsters)
            </h3>
          </div>
          <div className="bg-white divide-y divide-gray-100">
            {eggs.requirements.map((req) => (
              <div
                key={req.monster}
                className="flex justify-between items-center px-4 py-2.5"
              >
                <span className="font-medium text-gray-900">{req.monster}</span>
                <span className="text-sm bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium">
                  ×{req.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
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
    </div>
  );
}
