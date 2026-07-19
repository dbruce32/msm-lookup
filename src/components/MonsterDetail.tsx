"use client";

import type { Monster } from "@/lib/types";
import { BreedingCard } from "./BreedingCard";

interface MonsterDetailProps {
  monster: Monster;
  onBack: () => void;
}

const ELEMENT_COLORS: Record<string, string> = {
  Plant: "bg-green-100 text-green-800 border-green-200",
  Earth: "bg-orange-100 text-orange-800 border-orange-200",
  Water: "bg-blue-100 text-blue-800 border-blue-200",
  Cold: "bg-cyan-100 text-cyan-800 border-cyan-200",
  Air: "bg-sky-100 text-sky-800 border-sky-200",
  Fire: "bg-red-100 text-red-800 border-red-200",
  Light: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Psychic: "bg-purple-100 text-purple-800 border-purple-200",
  Faerie: "bg-pink-100 text-pink-800 border-pink-200",
  Bone: "bg-stone-100 text-stone-800 border-stone-200",
  Plasma: "bg-violet-100 text-violet-800 border-violet-200",
  Shadow: "bg-gray-200 text-gray-800 border-gray-300",
  Mech: "bg-zinc-100 text-zinc-800 border-zinc-200",
  Crystal: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Poison: "bg-lime-100 text-lime-800 border-lime-200",
  Legendary: "bg-amber-100 text-amber-800 border-amber-200",
  Mythical: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  Dream: "bg-teal-100 text-teal-800 border-teal-200",
};

function ElementBadge({ element }: { element: string }) {
  const colors = ELEMENT_COLORS[element] ?? "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${colors}`}>
      {element}
    </span>
  );
}

export function MonsterDetail({ monster, onBack }: MonsterDetailProps) {
  const islands = Object.entries(monster.breeding);

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
        <h2 className="text-2xl font-bold text-slate-900">{monster.name}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {monster.class}
          {monster.variants.length > 0 && (
            <> · {monster.variants.join(", ")}</>
          )}
        </p>
        {monster.elements.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {monster.elements.map((el) => (
              <ElementBadge key={el} element={el} />
            ))}
          </div>
        )}
      </div>

      {islands.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No breeding data available for this monster.
        </p>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Breeding Combinations</h3>
          {islands.map(([island, breeding]) => (
            <BreedingCard key={island} island={island} breeding={breeding} />
          ))}
        </div>
      )}
    </div>
  );
}
