"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import type { Monster } from "@/lib/types";
import { MonsterDetail } from "./MonsterDetail";

interface MonsterSearchProps {
  monsters: Monster[];
}

export function MonsterSearch({ monsters }: MonsterSearchProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Monster | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return monsters.filter((m) => m.name.toLowerCase().includes(q));
  }, [query, monsters]);

  const getItemId = (index: number) => `monster-option-${index}`;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!filtered.length || selected) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < filtered.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : filtered.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filtered.length) {
            setSelected(filtered[focusedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setFocusedIndex(-1);
          break;
      }
    },
    [filtered, focusedIndex, selected]
  );

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="monster-search" className="sr-only">
          Search monsters
        </label>
        <input
          id="monster-search"
          type="text"
          placeholder="Search for a monster..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
            setFocusedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg
                     bg-white text-gray-900 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     placeholder:text-gray-400"
          aria-label="Search monsters by name"
          aria-controls="monster-results-listbox"
          aria-activedescendant={
            focusedIndex >= 0 ? getItemId(focusedIndex) : undefined
          }
          autoComplete="off"
          role="combobox"
          aria-expanded={filtered.length > 0 && !selected}
          aria-autocomplete="list"
        />
      </div>

      {query.trim() && !selected && (
        <div>
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No monsters found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </p>
              <ul
                ref={listRef}
                id="monster-results-listbox"
                role="listbox"
                className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm"
              >
                {filtered.map((monster, index) => (
                  <li
                    key={monster.name}
                    id={getItemId(index)}
                    role="option"
                    aria-selected={focusedIndex === index}
                  >
                    <button
                      onClick={() => setSelected(monster)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      onMouseLeave={() => setFocusedIndex(-1)}
                      className={`w-full text-left px-4 py-3 transition-colors
                                 focus:outline-none
                                 ${
                                   focusedIndex === index
                                     ? "bg-indigo-50 ring-2 ring-inset ring-indigo-400"
                                     : "hover:bg-gray-50"
                                 }`}
                      tabIndex={-1}
                    >
                      <span className="font-medium text-gray-900">{monster.name}</span>
                      <span className="ml-2 text-xs text-gray-400">
                        {monster.class}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        · {monster.elements.join(", ")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {selected && (
        <MonsterDetail
          monster={selected}
          onBack={() => setSelected(null)}
        />
      )}
    </div>
  );
}
