"use client";

import type { Monster } from "@/lib/types";
import { BreedingCard } from "./BreedingCard";
import { ElementIcon } from "./ElementIcon";

interface MonsterDetailProps {
  monster: Monster;
  onBack: () => void;
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
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            {monster.elements.map((el) => (
              <ElementIcon key={el} element={el} size={28} />
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
