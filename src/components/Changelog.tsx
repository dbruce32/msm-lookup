export function Changelog() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Changelog</h2>
        <p className="text-sm text-gray-500">Updates and new features by date</p>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* August 9, 2026 — Dipster Digs Solver */}
        <div className="relative pb-8">
          <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                New Feature
              </span>
              <time className="text-sm text-gray-500" dateTime="2026-08-09">
                August 9, 2026
              </time>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dipster Digs Solver
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>New Dipster Digs minigame helper tool on dedicated page</li>
              <li>Interactive grid with setup phase (dimensions, obstacles) and play phase</li>
              <li>Minesweeper-style constraint solver with set-based intersection reasoning</li>
              <li>Probability estimation for uncertain tiles with color-coded display</li>
              <li>Recommended next dig highlighting — all equally-good tiles shown</li>
              <li>Token-efficient strategy: prioritizes guaranteed Dipsters, then highest probability</li>
              <li>Obstacle support (Broken Rock, Small Rock) with dig cost tracking</li>
              <li>Zworaffe support with automatic cardinal neighbor reveal</li>
              <li>Flag mode for manual player tracking</li>
              <li>&ldquo;How This Is Calculated&rdquo; tab explaining the solver approach</li>
              <li>Disclaimer noting approximate (not optimal) solutions</li>
            </ul>
          </div>
        </div>

        {/* August 9, 2026 — UI Polish */}
        <div className="relative pb-8">
          <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white" />
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                Improvement
              </span>
              <time className="text-sm text-gray-500" dateTime="2026-08-09">
                August 9, 2026
              </time>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              UI Polish
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>Header navigation link to Dipster Digs</li>
              <li>Fixed overscroll color — dark blue (slate-800) now shows instead of white when scrolling past page bounds</li>
            </ul>
          </div>
        </div>

        {/* July 31, 2026 — Sidebar & Seasonal Events */}
        <div className="relative pb-8">
          <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                New Feature
              </span>
              <time className="text-sm text-gray-500" dateTime="2026-07-31">
                July 31, 2026
              </time>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sidebar &amp; Seasonal Events
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>Desktop sidebar with seasonal event indicator and quick links</li>
              <li>Seasonal event calendar with approximate date ranges for all 15 MSM events</li>
              <li>Shows currently active event or next upcoming event</li>
              <li>Mobile-friendly: compact event banner above tabs on small screens</li>
              <li>Quick links to MSM Wiki, Reddit, Discord, Official Site, and msm-db</li>
            </ul>
          </div>
        </div>

        {/* July 31, 2026 — Navigation & Search Improvements */}
        <div className="relative pb-8">
          <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white" />
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                Improvement
              </span>
              <time className="text-sm text-gray-500" dateTime="2026-07-31">
                July 31, 2026
              </time>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Navigation &amp; Search Improvements
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>Grouped tab navigation: Monsters vs Info sections with visual separator</li>
              <li>About tab moved to the far right</li>
              <li>Horizontal scroll on mobile for tabs (no more overflow/wrapping)</li>
              <li>Improved &ldquo;no results&rdquo; state with contextual messages and a clear filters button</li>
              <li>Header now shows &ldquo;Data refreshed daily 06:00 UTC&rdquo;</li>
              <li>Fixed gitignore to cover all generated data files in src/data/</li>
            </ul>
          </div>
        </div>

        {/* July 31, 2026 — MSM Patch Notes */}
        <div className="relative pb-8">
          <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                New Feature
              </span>
              <time className="text-sm text-gray-500" dateTime="2026-07-31">
                July 31, 2026
              </time>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              MSM Patch Notes Tab
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>New &ldquo;News&rdquo; tab with official MSM game patch notes</li>
              <li>Data fetched from the MSM wiki at build time</li>
              <li>40 version entries from v4.0.0 through v5.5.0</li>
              <li>Timeline layout with version badges and official post links</li>
              <li>&ldquo;Show all&rdquo; toggle to expand beyond the initial 10 entries</li>
            </ul>
          </div>
        </div>

        {/* July 30, 2026 — Changelog Tab */}
        <div className="relative pb-8">
          <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                New Feature
              </span>
              <time className="text-sm text-gray-500" dateTime="2026-07-30">
                July 30, 2026
              </time>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Changelog Tab
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>In-app changelog with vertical timeline layout</li>
              <li>Entries organized by commit date with color-coded badges</li>
            </ul>
          </div>
        </div>

        {/* July 30, 2026 — Egg Island Breeding Planner */}
        <div className="relative pb-8">
          <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                New Feature
              </span>
              <time className="text-sm text-gray-500" dateTime="2026-07-30">
                July 30, 2026
              </time>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Egg Island Breeding Planner
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>Gantt chart breeding planner for egg requirements</li>
              <li>Island-based scheduling that distributes breeding across all available islands</li>
              <li>Collapsible sections for Egg Info, Requirements, and Breeding Planner</li>
              <li>Availability countdown for Celestials</li>
              <li>Planner opens by default for immediate visibility</li>
              <li>Fixed missing Paironormal element icons (Control, Depths, Hoax)</li>
            </ul>
          </div>
        </div>

        {/* July 30, 2026 — Available Celestials Filter */}
        <div className="relative pb-8">
          <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                New Feature
              </span>
              <time className="text-sm text-gray-500" dateTime="2026-07-30">
                July 30, 2026
              </time>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Available Celestials Filter
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>&ldquo;Available Now&rdquo; button to filter Celestials by current availability</li>
            </ul>
          </div>
        </div>

        {/* July 30, 2026 — UI Enhancements */}
        <div className="relative pb-8">
          <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white" />
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                Improvement
              </span>
              <time className="text-sm text-gray-500" dateTime="2026-07-30">
                July 30, 2026
              </time>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              UI Enhancements &amp; Asset Icons
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>Tabbed UI with Wublins and Celestials egg views</li>
              <li>Element icons for monster types</li>
              <li>Asset icons for islands, currency, and grid</li>
              <li>Category filter toggles for Wublins and Celestials tabs</li>
              <li>About page with project links</li>
              <li>Maw favicon and header logo</li>
              <li>Improved visibility with better contrast</li>
            </ul>
          </div>
        </div>

        {/* July 19, 2026 — Initial Release */}
        <div className="relative">
          <div className="absolute left-[-20px] top-1 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-white" />
          <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                Launch
              </span>
              <time className="text-sm text-gray-500" dateTime="2026-07-19">
                July 19, 2026
              </time>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Initial Release
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>Monster search by name with instant filtering</li>
              <li>Breeding combinations grouped by island (common, rare, epic variants)</li>
              <li>Breeding times and enhanced breeding times display</li>
              <li>Keyboard navigation (arrow keys, Enter, Escape)</li>
              <li>Static export for GitHub Pages hosting</li>
              <li>GitHub Actions CI/CD with daily data rebuild</li>
              <li>Retry logic and API throttling for data fetches</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
