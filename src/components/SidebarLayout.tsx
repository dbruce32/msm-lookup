"use client";

import { SeasonalEventDisplay } from "./SeasonalEvent";
import { QuickLinks } from "./QuickLinks";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div>
      {/* Mobile banner — visible below lg */}
      <div className="lg:hidden mb-4">
        <SeasonalEventDisplay variant="banner" />
      </div>

      {/* Desktop: main content + sidebar */}
      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Desktop sidebar — hidden below lg */}
        <aside className="hidden lg:block w-72 flex-shrink-0 space-y-4">
          <SeasonalEventDisplay variant="card" />
          <QuickLinks />
        </aside>
      </div>
    </div>
  );
}
