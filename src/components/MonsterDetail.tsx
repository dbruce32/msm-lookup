"use client";

import type { Monster } from "@/lib/types";
import { BreedingCard } from "./BreedingCard";

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
        className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none
                   focus:underline"
      >
        ← Back to results
      </button>

      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h2 className="text-2xl font-bold">{monster.name}</h2>
        <div className="mt-1 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">
            Class: <strong>{monster.class}</strong>
          </span>
          {monster.elements.length > 0 && (
            <span className="text-sm text-gray-600">
              Elements: <strong>{monster.elements.join(", ")}</strong>
            </span>
          )}
        </div>
        {monster.variants.length > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            Variants: {monster.variants.join(", ")}
          </p>
        )}
      </div>

      {islands.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No breeding data available for this monster.
        </p>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Breeding Combinations</h3>
          {islands.map(([island, breeding]) => (
            <BreedingCard key={island} island={island} breeding={breeding} />
          ))}
        </div>
      )}
    </div>
  );
}
