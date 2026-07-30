"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div role="tablist" aria-label="Content sections" className="flex border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors
                       focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500
                       ${
                         isActive
                           ? "border-b-2 border-indigo-600 text-indigo-700"
                           : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                       }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
