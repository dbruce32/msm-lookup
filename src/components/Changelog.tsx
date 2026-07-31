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
