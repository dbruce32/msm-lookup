"use client";

import { useState } from "react";
import type { Monster } from "@/lib/types";
import { Tabs } from "./Tabs";
import { MonsterSearch } from "./MonsterSearch";
import { EggSearch } from "./EggSearch";
import { Changelog } from "./Changelog";

const TABS = [
  { id: "breeding", label: "Breeding" },
  { id: "wublins", label: "Wublins" },
  { id: "celestials", label: "Celestials" },
  { id: "about", label: "About" },
  { id: "changelog", label: "Changelog" },
];

interface TabbedHomeProps {
  monsters: Monster[];
  wublins: Monster[];
  celestials: Monster[];
  allMonsters: Monster[];
}

export function TabbedHome({ monsters, wublins, celestials, allMonsters }: TabbedHomeProps) {
  const [activeTab, setActiveTab] = useState("breeding");

  return (
    <div className="space-y-6">
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === "breeding" && <MonsterSearch monsters={monsters} />}
        {activeTab === "wublins" && (
          <EggSearch monsters={wublins} label="Wublins" allMonsters={allMonsters} />
        )}
        {activeTab === "celestials" && (
          <EggSearch monsters={celestials} label="Celestials" allMonsters={allMonsters} />
        )}
        {activeTab === "about" && (
          <div className="space-y-6">
            {/* Description */}
            <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">About MSM Lookup</h2>
              <p className="text-gray-600 leading-relaxed">
                A free, open-source search engine for My Singing Monsters breeding combinations.
                Look up any monster to find its breeding pairs, times, and enhanced times across
                all islands. Browse Wublin and Celestial egg inventories to plan your collections.
                Data is synced daily from the msm-db API. No account needed!!
              </p>
            </div>

            {/* Profile card */}
            <a
              href="https://github.com/dbruce32"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg p-6 bg-white shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-4"
            >
              <img
                src="https://github.com/dbruce32.png"
                alt="dbruce32"
                width={64}
                height={64}
                className="rounded-full border-2 border-gray-200"
              />
              <div>
                <span className="text-lg font-bold text-gray-900">dbruce32</span>
                <p className="text-sm text-gray-500">Creator & Maintainer</p>
              </div>
            </a>

            {/* Repositories */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Repositories
              </h3>
              <a
                href="https://github.com/dbruce32/msm-lookup"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg p-4 bg-white shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 16 16" width="24" height="24" className="text-gray-700 flex-shrink-0" fill="currentColor" aria-hidden="true">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900">msm-lookup</span>
                    <p className="text-sm text-gray-500 mt-0.5">Static search engine for breeding combinations</p>
                  </div>
                </div>
              </a>
              <a
                href="https://github.com/dbruce32/msm-db"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg p-4 bg-white shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 16 16" width="24" height="24" className="text-gray-700 flex-shrink-0" fill="currentColor" aria-hidden="true">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900">msm-db</span>
                    <p className="text-sm text-gray-500 mt-0.5">Monster data API and asset hosting</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}
        {activeTab === "changelog" && <Changelog />}
      </div>
    </div>
  );
}
