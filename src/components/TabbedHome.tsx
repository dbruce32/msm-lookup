"use client";

import { useState } from "react";
import type { Monster } from "@/lib/types";
import { Tabs } from "./Tabs";
import { MonsterSearch } from "./MonsterSearch";
import { EggSearch } from "./EggSearch";

const TABS = [
  { id: "breeding", label: "Breeding" },
  { id: "wublins", label: "Wublins" },
  { id: "celestials", label: "Celestials" },
];

interface TabbedHomeProps {
  monsters: Monster[];
  wublins: Monster[];
  celestials: Monster[];
}

export function TabbedHome({ monsters, wublins, celestials }: TabbedHomeProps) {
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
          <EggSearch monsters={wublins} label="Wublins" />
        )}
        {activeTab === "celestials" && (
          <EggSearch monsters={celestials} label="Celestials" />
        )}
      </div>
    </div>
  );
}
