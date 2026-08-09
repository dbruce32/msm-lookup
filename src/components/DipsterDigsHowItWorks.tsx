"use client";

export function DipsterDigsHowItWorks() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Overview</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          This solver uses techniques from Minesweeper solvers adapted for Dipster Digs.
          After each tile you reveal, it runs a constraint-solving pipeline to determine
          which tiles <strong>definitely</strong> contain a Dipster, which tiles
          <strong> cannot possibly</strong> contain one, and assigns probability estimates
          to everything in between.
        </p>
      </div>

      {/* Phase 1 */}
      <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Phase 1: Basic Constraint Propagation</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Every revealed number tile creates a constraint: &ldquo;exactly <em>N</em> of my 8 neighbors
          are Dipsters.&rdquo; The solver checks each constraint:
        </p>
        <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
          <li>
            <strong>All accounted for:</strong> If the number of known/deduced Dipsters around a tile
            already equals its number, then all remaining hidden neighbors
            <em> cannot have a Dipster</em>.
          </li>
          <li>
            <strong>All must be Dipsters:</strong> If the number of remaining uncertain hidden neighbors
            equals exactly how many Dipsters are still needed, then every one of those neighbors
            <em> must be a Dipster</em>.
          </li>
        </ul>
        <p className="text-sm text-gray-700 leading-relaxed">
          This phase runs repeatedly until no new deductions are made — each new deduction
          can cascade into further deductions from neighboring constraints.
        </p>
      </div>

      {/* Phase 2 */}
      <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Phase 2: Set-Based Intersection Reasoning</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          When basic propagation stalls, the solver compares pairs of constraints that share tiles.
          If one constraint&apos;s tile set is a <strong>subset</strong> of another&apos;s, we can reason
          about the difference:
        </p>
        <div className="bg-gray-50 rounded-md p-4 text-sm font-mono text-gray-800">
          Constraint A: tiles &#123;X, Y&#125; contain 1 Dipster<br />
          Constraint B: tiles &#123;X, Y, Z&#125; contain 1 Dipster<br />
          <br />
          → A ⊆ B, so the difference &#123;Z&#125; must contain (1 − 1) = 0 Dipsters<br />
          → Z cannot have a Dipster!
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Similarly, if the difference set has exactly as many tiles as Dipsters needed,
          all tiles in the difference must be Dipsters. This catches patterns that basic
          propagation alone would miss.
        </p>
      </div>

      {/* Phase 3 */}
      <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Phase 3: Probability Estimation</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          After constraint propagation, some tiles remain uncertain. The solver assigns each
          a probability of containing a Dipster:
        </p>
        <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
          <li>
            <strong>Global constraint:</strong> The total number of unfound Dipsters is known.
            Subtract any deduced (guaranteed) Dipsters and flags — the remainder must be
            distributed among uncertain tiles.
          </li>
          <li>
            <strong>Local density weighting:</strong> Each uncertain tile may participate in
            one or more number constraints. The solver calculates the <em>local density</em>
            implied by each constraint (remaining Dipsters ÷ uncertain neighbors) and averages
            them to weight the tile.
          </li>
          <li>
            <strong>Normalization:</strong> All uncertain tile probabilities are scaled so they
            sum to the expected number of unaccounted Dipsters. This ensures the numbers are
            globally consistent.
          </li>
        </ol>
        <p className="text-sm text-gray-700 leading-relaxed">
          Edge cases: if all Dipsters are accounted for, every uncertain tile becomes
          &ldquo;cannot have Dipster.&rdquo; If there are more unaccounted Dipsters than uncertain tiles,
          they must all be Dipsters.
        </p>
      </div>

      {/* Recommendation */}
      <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Recommended Next Dig</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          The recommendation optimizes for <strong>minimum tokens spent</strong> to find all
          Dipsters. Tokens are scarce, so every dig should either find a Dipster or have a
          very good reason not to. Priority order:
        </p>
        <ol className="text-sm text-gray-700 space-y-3 list-decimal list-inside">
          <li>
            <strong>Guaranteed Dipster (no obstacle):</strong> 1 token = 1 Dipster found.
            Best possible value. All such tiles are highlighted.
          </li>
          <li>
            <strong>Guaranteed Dipster (behind obstacle):</strong> Costs extra tokens to clear
            the rock first, but still a sure find. Compared against probability tiles — only
            recommended if the probability tiles aren&apos;t better expected value.
          </li>
          <li>
            <strong>Highest probability tiles:</strong> Among uncertain tiles with no obstacle,
            all tiles tied at the highest probability are highlighted. If the chance is ≥40%,
            these are recommended over info digs.
          </li>
          <li>
            <strong>Info dig (last resort):</strong> If the best probability is below 40% and
            there exists a &ldquo;cannot have Dipster&rdquo; tile with 3+ uncertain neighbors, digging it
            will reveal a number that may cascade into guaranteed deductions — potentially
            saving multiple tokens. Only recommended when the expected info gain justifies the
            token cost.
          </li>
        </ol>
        <p className="text-sm text-gray-700 leading-relaxed">
          When multiple tiles are equally good, they&apos;re all highlighted — pick whichever
          you like.
        </p>
      </div>

      {/* Tile colors */}
      <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Tile Color Guide</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-green-200 border-2 border-green-400 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Green (ring)</p>
              <p className="text-gray-600">Guaranteed Dipster — dig it for sure progress</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-blue-50 border-2 border-blue-200 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Blue</p>
              <p className="text-gray-600">Cannot have Dipster — safe info dig if needed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-orange-200 border-2 border-orange-400 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Orange</p>
              <p className="text-gray-600">High probability (≥70%) — likely a Dipster</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-yellow-100 border-2 border-yellow-300 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Yellow</p>
              <p className="text-gray-600">Medium probability (40–69%)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-amber-50 border-2 border-amber-200 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Light amber</p>
              <p className="text-gray-600">Low probability (&lt;40%)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-white border-2 border-gray-200 ring-2 ring-indigo-500 ring-offset-1 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Indigo ring</p>
              <p className="text-gray-600">Recommended next dig</p>
            </div>
          </div>
        </div>
      </div>

      {/* Limitations */}
      <div className="rounded-lg p-6 bg-white shadow-sm border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Limitations</h3>
        <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
          <li>
            <strong>2×2 Dipsters:</strong> The solver treats each tile independently. It doesn&apos;t
            currently model the constraint that some Dipsters occupy a 2×2 square (which would
            mean 4 adjacent tiles must all be Dipsters together). In practice this means it may
            slightly underestimate probability in areas where a 2×2 Dipster could fit.
          </li>
          <li>
            <strong>Probability is an estimate:</strong> For complex board states, exact
            probability would require enumerating all valid Dipster configurations (exponential
            complexity). The solver uses a weighted heuristic that&apos;s fast and usually close,
            but not mathematically exact.
          </li>
          <li>
            <strong>Zworaffes:</strong> Since Zworaffe count is unknown, the solver treats them
            as regular Dipsters. If one is found, it automatically reveals cardinal neighbors
            (bonus value not factored into pre-dig recommendations).
          </li>
        </ul>
      </div>
    </div>
  );
}
