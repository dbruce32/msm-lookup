"use client";

import { useMemo } from "react";
import { SEASONAL_EVENTS, type SeasonalEvent } from "@/lib/seasonal-events";

/**
 * Check if a given date falls within an event's approximate window.
 * Handles year-wrapping events (e.g., Dec 5 – Jan 5).
 */
function isDateInRange(
  month: number,
  day: number,
  start: { month: number; day: number },
  end: { month: number; day: number }
): boolean {
  const date = month * 100 + day;
  const startVal = start.month * 100 + start.day;
  const endVal = end.month * 100 + end.day;

  if (startVal <= endVal) {
    // Normal range (e.g., Mar 3 – Mar 18)
    return date >= startVal && date <= endVal;
  } else {
    // Year-wrapping range (e.g., Dec 5 – Jan 5)
    return date >= startVal || date <= endVal;
  }
}

function getCurrentEvents(now: Date): SeasonalEvent[] {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return SEASONAL_EVENTS.filter((e) => isDateInRange(month, day, e.start, e.end));
}

function getNextEvent(now: Date): SeasonalEvent {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dateVal = month * 100 + day;

  // Find the next event whose start is after today
  for (const event of SEASONAL_EVENTS) {
    const startVal = event.start.month * 100 + event.start.day;
    if (startVal > dateVal) {
      return event;
    }
  }
  // Wrap around to first event of next year
  return SEASONAL_EVENTS[0];
}

function formatDateRange(start: { month: number; day: number }, end: { month: number; day: number }): string {
  const months = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  if (start.month === end.month) {
    return `${months[start.month]} ${start.day}–${end.day}`;
  }
  return `${months[start.month]} ${start.day} – ${months[end.month]} ${end.day}`;
}

interface SeasonalEventDisplayProps {
  variant: "banner" | "card";
}

export function SeasonalEventDisplay({ variant }: SeasonalEventDisplayProps) {
  const { current, next } = useMemo(() => {
    const now = new Date();
    const currentEvents = getCurrentEvents(now);
    const nextEvent = currentEvents.length === 0 ? getNextEvent(now) : null;
    return { current: currentEvents, next: nextEvent };
  }, []);

  if (variant === "banner") {
    if (current.length > 0) {
      return (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm text-indigo-800">
          <span className="mr-1.5">🎵</span>
          <strong>{current[0].name}</strong> is typically active now
          <span className="text-indigo-600 ml-1">({current[0].island})</span>
        </div>
      );
    }
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
        <span className="mr-1.5">📅</span>
        Next up: <strong>{next!.name}</strong>
        <span className="text-gray-500 ml-1">
          · typically {formatDateRange(next!.start, next!.end)}
        </span>
      </div>
    );
  }

  // Card variant for desktop sidebar
  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-slate-800 text-white">
        <h3 className="text-sm font-semibold">Seasonal Events</h3>
      </div>
      <div className="p-4 space-y-3">
        {current.length > 0 ? (
          <>
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none mt-0.5">🎵</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Likely active now
                </p>
                {current.map((event) => (
                  <div key={event.name} className="mt-1">
                    <p className="text-sm font-semibold text-indigo-700">
                      {event.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.island} · {event.holiday}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 italic">
              Dates are approximate and vary each year
            </p>
          </>
        ) : (
          <>
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none mt-0.5">📅</span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  No event right now
                </p>
                <div className="mt-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Next: {next!.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {next!.island} · {next!.holiday}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Typically {formatDateRange(next!.start, next!.end)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 italic">
              Dates are approximate and vary each year
            </p>
          </>
        )}
      </div>
    </div>
  );
}
