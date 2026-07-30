"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import type { Monster } from "@/lib/types";
import { EggDetail } from "./EggDetail";
import { ElementIcon } from "./ElementIcon";

interface EggSearchProps {
  monsters: Monster[];
  label: string;
}

export function EggSearch({ monsters, label }: EggSearchProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Monster | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return monsters;
    const q = query.toLowerCase().trim();
    return monsters.filter((m) => m.name.toLowerCase().includes(q));
  }, [query, monsters]);

  const getItemId = (index: number) => `egg-option-${label}-${index}`;
  const inputId = `egg-search-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const listboxId = `egg-results-${label.toLowerCase().replace(/\s+/g, "-")}`;

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

  const classBadge = (cls: string) => {
    switch (cls) {
      case "Wublin":
        return "bg-emerald-50 text-emerald-700";
      case "Rare Wublin":
        return "bg-blue-50 text-blue-700";
      case "Epic Wublin":
        return "bg-amber-50 text-amber-700";
      case "Celestial":
        return "bg-violet-50 text-violet-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor={inputId} className="sr-only">
          Search {label}
        </label>
        <input
          id={inputId}
          type="text"
          placeholder={`Search ${label.toLowerCase()}...`}
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
          aria-label={`Search ${label} by name`}
          aria-controls={listboxId}
          aria-activedescendant={
            focusedIndex >= 0 ? getItemId(focusedIndex) : undefined
          }
          autoComplete="off"
          role="combobox"
          aria-expanded={!selected}
          aria-autocomplete="list"
        />
      </div>

      {!selected && (
        <div>
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No results found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                {filtered.length} {label.toLowerCase()}
                {filtered.length !== 1 ? "" : ""}
              </p>
              <ul
                ref={listRef}
                id={listboxId}
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
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors
                                 focus:outline-none
                                 ${
                                   focusedIndex === index
                                     ? "bg-indigo-50 ring-2 ring-inset ring-indigo-400"
                                     : "hover:bg-gray-50"
                                 }`}
                      tabIndex={-1}
                    >
                      <ElementIcon
                        element={label === "Wublins" ? "Electricity" : "Celestial"}
                        size={28}
                      />
                      <span className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900">
                          {monster.name}
                        </span>
                        <span
                          className={`ml-2 text-xs px-1.5 py-0.5 rounded ${classBadge(monster.class)}`}
                        >
                          {monster.class}
                        </span>
                        {monster.eggs?.total != null && (
                          <span className="ml-2 text-xs text-gray-400">
                            {monster.eggs.total} eggs
                          </span>
                        )}
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
        <EggDetail monster={selected} onBack={() => setSelected(null)} />
      )}
    </div>
  );
}
