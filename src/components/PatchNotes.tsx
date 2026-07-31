"use client";

import { useState } from "react";

interface PatchNote {
  version: string;
  releaseDate: string | null;
  highlights: string[];
  officialUrl: string | null;
}

interface PatchNotesProps {
  notes: PatchNote[];
}

const INITIAL_COUNT = 10;

export function PatchNotes({ notes }: PatchNotesProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? notes : notes.slice(0, INITIAL_COUNT);

  return (
    <div className="space-y-6">
      <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-1">MSM Patch Notes</h2>
        <p className="text-sm text-gray-500">
          Official game updates from the My Singing Monsters wiki
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />

        {visible.map((note, i) => (
          <div
            key={note.version}
            className={`relative ${i < visible.length - 1 ? "pb-8" : ""}`}
          >
            {/* Dot */}
            <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />

            {/* Card */}
            <div className="rounded-lg p-5 bg-white shadow-sm border border-gray-200">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-800 text-white">
                    v{note.version}
                  </span>
                  {note.releaseDate && (
                    <time className="text-sm text-gray-500">
                      {note.releaseDate}
                    </time>
                  )}
                </div>
                {note.officialUrl && (
                  <a
                    href={note.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:text-indigo-800 underline flex-shrink-0"
                  >
                    Official post ↗
                  </a>
                )}
              </div>

              {note.highlights.length > 0 ? (
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  {note.highlights.map((highlight, j) => (
                    <li key={j}>{highlight}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Bug fixes and minor improvements.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show more/less */}
      {notes.length > INITIAL_COUNT && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            {showAll
              ? "Show less"
              : `Show all ${notes.length} versions`}
          </button>
        </div>
      )}
    </div>
  );
}
