"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import type { Monster } from "@/lib/types";
import { MonsterDetail } from "./MonsterDetail";
import { ElementIcon } from "./ElementIcon";

interface MonsterSearchProps {
  monsters: Monster[];
}

export function MonsterSearch({ monsters }: MonsterSearchProps) {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("");
  const [selected, setSelected] = useState<Monster | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement>(null);

  const classes = useMemo(() => {
    const set = new Set<string>();
    for (const m of monsters) set.add(m.class);
    return Array.from(set).sort();
  }, [monsters]);

  const filtered = useMemo(() => {
    let result = monsters;
    if (classFilter) {
      result = result.filter((m) => m.class === classFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter((m) => m.name.toLowerCase().includes(q));
    }
    return result;
  }, [query, classFilter, monsters]);

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
      <div className="space-y-3">
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
        <div>
          <label htmlFor="class-filter" className="sr-only">
            Filter by class
          </label>
          <select
            id="class-filter"
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setSelected(null);
              setFocusedIndex(-1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                       bg-white text-gray-700 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selected && (
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
                className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm max-h-96 overflow-y-auto"
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
                      className={`w-full text-left px-4 py-3 flex items-center gap-2 transition-colors
                                 focus:outline-none
                                 ${
                                   focusedIndex === index
                                     ? "bg-indigo-50 ring-2 ring-inset ring-indigo-400"
                                     : "hover:bg-gray-50"
                                 }`}
                      tabIndex={-1}
                    >
                      <span className="font-medium text-gray-900">{monster.name}</span>
                      <span className="inline-flex gap-1 items-center">
                        {monster.elements.map((el) => (
                          <ElementIcon key={el} element={el} size={22} />
                        ))}
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {monster.class}
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
