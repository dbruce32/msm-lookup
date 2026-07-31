"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabGroup {
  label: string;
  align?: "left" | "right";
  tabs: Tab[];
}

interface TabsProps {
  tabGroups: TabGroup[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function Tabs({ tabGroups, activeTab, onTabChange }: TabsProps) {
  const leftGroups = tabGroups.filter((g) => g.align !== "right");
  const rightGroups = tabGroups.filter((g) => g.align === "right");

  function renderGroup(group: TabGroup, groupIndex: number, showLeadingSeparator: boolean) {
    return (
      <div key={group.label} className="flex items-center">
        {showLeadingSeparator && (
          <div className="mx-2 h-6 w-px bg-gray-300" aria-hidden="true" />
        )}
        {group.tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors
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

  return (
    <div role="tablist" aria-label="Content sections" className="flex overflow-x-auto border-b border-gray-200 scrollbar-none">
      {leftGroups.map((group, i) => renderGroup(group, i, i > 0))}
      {rightGroups.length > 0 && (
        <div className="ml-auto flex items-center">
          {rightGroups.map((group, i) => renderGroup(group, i, i > 0))}
        </div>
      )}
    </div>
  );
}
