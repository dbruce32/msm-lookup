"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import type { Monster } from "@/lib/types";
import { EggDetail } from "./EggDetail";
import { ElementIcon } from "./ElementIcon";

interface EggSearchProps {
  monsters: Monster[];
  label: string;
  allMonsters: Monster[];
}

type FilterKey = string;

const WUBLIN_FILTERS: { key: FilterKey; label: string }[] = [
  { key: "Wublin", label: "Common" },
  { key: "Rare Wublin", label: "Rare" },
  { key: "Epic Wublin", label: "Epic" },
];

const CELESTIAL_FILTERS: { key: FilterKey; label: string }[] = [
  { key: "young", label: "Young" },
  { key: "adult", label: "Adult" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Checks if a celestial monster is currently available based on its
 * availability string (e.g. "December 1st 3:00pm UTC to January 1st 3:00pm UTC").
 */
function isCelestialAvailable(monster: Monster): boolean {
  const availability = monster.eggs?.availability;
  if (!availability) return false;

  // Parse start and end months from the availability string
  const match = availability.match(/^(\w+)\s+\d+.*?to\s+(\w+)\s+\d+/);
  if (!match) return false;

  const startMonth = MONTH_NAMES.indexOf(match[1]);
  const endMonth = MONTH_NAMES.indexOf(match[2]);
  if (startMonth === -1 || endMonth === -1) return false;

  const now = new Date();
  const currentMonth = now.getUTCMonth(); // 0-indexed
  const currentDay = now.getUTCDate();
  const currentHour = now.getUTCHours();

  // Availability runs from the 1st at 15:00 UTC to the 1st at 15:00 UTC
  // Check if we're within the window
  if (startMonth <= endMonth) {
    // Same year range (e.g., March to April)
    if (currentMonth > startMonth && currentMonth < endMonth) return true;
    if (currentMonth === startMonth && (currentDay > 1 || (currentDay === 1 && currentHour >= 15))) return true;
    if (currentMonth === endMonth && (currentDay < 1 || (currentDay === 1 && currentHour < 15))) return true;
  } else {
    // Wraps around year boundary (e.g., December to January)
    if (currentMonth > startMonth || currentMonth < endMonth) return true;
    if (currentMonth === startMonth && (currentDay > 1 || (currentDay === 1 && currentHour >= 15))) return true;
    if (currentMonth === endMonth && (currentDay < 1 || (currentDay === 1 && currentHour < 15))) return true;
  }

  return false;
}

/**
 * Calculate how many months until a celestial becomes available.
 * Returns null if no availability data or currently available.
 */
function monthsUntilAvailable(monster: Monster): number | null {
  if (isCelestialAvailable(monster)) return null;

  const availability = monster.eggs?.availability;
  if (!availability) return null;

  const match = availability.match(/^(\w+)\s+\d+/);
  if (!match) return null;

  const startMonth = MONTH_NAMES.indexOf(match[1]);
  if (startMonth === -1) return null;

  const now = new Date();
  const currentMonth = now.getUTCMonth();

  let months = startMonth - currentMonth;
  if (months <= 0) months += 12;

  return months;
}

export function EggSearch({ monsters, label, allMonsters }: EggSearchProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Monster | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all");
  const listRef = useRef<HTMLUListElement>(null);

  const filters = label === "Wublins" ? WUBLIN_FILTERS : CELESTIAL_FILTERS;
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(
    () => new Set(filters.map((f) => f.key))
  );

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Don't allow deselecting all
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
    setSelected(null);
    setFocusedIndex(-1);
  };

  const filtered = useMemo(() => {
    let result = monsters;

    // Apply category filter
    if (label === "Wublins") {
      result = result.filter((m) => activeFilters.has(m.class));
    } else {
      // Celestials: young vs adult
      result = result.filter((m) => {
        const isAdult = m.name.startsWith("Adult");
        if (isAdult) return activeFilters.has("adult");
        return activeFilters.has("young");
      });

      // Available now filter (Celestials only)
      if (availabilityFilter === "available") {
        result = result.filter((m) => isCelestialAvailable(m));
      } else if (availabilityFilter === "unavailable") {
        result = result.filter((m) => !isCelestialAvailable(m));
      }
    }

    // Apply text search
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter((m) => m.name.toLowerCase().includes(q));
    }

    return result;
  }, [query, monsters, label, activeFilters, availabilityFilter]);

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
    <div className="space-y-4">
      <div className="space-y-3">
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

        <div className="flex gap-2 flex-wrap" role="group" aria-label={`Filter ${label} by type`}>
          {filters.map((f) => {
            const isActive = activeFilters.has(f.key);
            return (
              <button
                key={f.key}
                onClick={() => toggleFilter(f.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors
                           focus:outline-none focus:ring-2 focus:ring-indigo-500
                           ${
                             isActive
                               ? "bg-indigo-600 text-white border-indigo-600"
                               : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
                           }`}
                aria-pressed={isActive}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        {label === "Celestials" && (
          <div className="flex gap-2" role="group" aria-label="Filter by availability">
            <button
              onClick={() => {
                setAvailabilityFilter((prev) => {
                  if (prev === "all") return "available";
                  if (prev === "available") return "unavailable";
                  return "all";
                });
                setSelected(null);
                setFocusedIndex(-1);
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors
                         focus:outline-none focus:ring-2 focus:ring-emerald-500
                         ${
                           availabilityFilter === "available"
                             ? "bg-emerald-600 text-white border-emerald-600"
                             : availabilityFilter === "unavailable"
                               ? "bg-gray-600 text-white border-gray-600"
                               : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
                         }`}
            >
              {availabilityFilter === "all" && "All"}
              {availabilityFilter === "available" && "🟢 Available"}
              {availabilityFilter === "unavailable" && "Unavailable"}
            </button>
          </div>
        )}
      </div>

      {!selected && (
        <div>
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No results found{query.trim() ? ` for "${query}"` : ""}
            </p>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                {filtered.length} {label.toLowerCase()}
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
                          {label === "Wublins"
                            ? monster.class
                            : monster.name.startsWith("Adult")
                              ? "Adult"
                              : "Young"}
                        </span>
                        {monster.eggs?.total != null && (
                          <span className="ml-2 text-xs text-gray-400">
                            {monster.eggs.total} eggs
                          </span>
                        )}
                        {label === "Celestials" && isCelestialAvailable(monster) && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Available
                          </span>
                        )}
                        {label === "Celestials" && !isCelestialAvailable(monster) && monthsUntilAvailable(monster) != null && (
                          <span className="ml-2 text-xs text-gray-400">
                            in {monthsUntilAvailable(monster)} mo
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
        <EggDetail monster={selected} onBack={() => setSelected(null)} allMonsters={allMonsters} />
      )}
    </div>
  );
}
