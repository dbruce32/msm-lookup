// ============================================================================
// Dipster Digs Constraint Solver
// A Minesweeper-like constraint solver for the Dipster Digs minigame.
// ============================================================================

// --- Types ---

export type TileState = 'hidden' | 'revealed' | 'flagged' | 'dipster' | 'zworaffe';
export type ObstacleType = 'none' | 'broken-rock' | 'small-rock';
export type TileSafety = 'no-dipster' | 'dipster' | 'uncertain';

export interface Tile {
  row: number;
  col: number;
  state: TileState;
  obstacle: ObstacleType;
  digsRemaining: number; // 0 = no obstacle, 1 = broken rock, 2 = small rock
  revealedNumber: number | null; // null if not yet revealed with a number
  safety: TileSafety;
  probability: number; // 0.0 to 1.0, probability of being a Dipster
  isRecommended: boolean; // true if this is the recommended next dig
}

export interface Recommendation {
  row: number;
  col: number;
  reason: string;
}

export interface GameState {
  rows: number;
  cols: number;
  tiles: Tile[][];
  totalDipsters: number;
  foundDipsters: number;
  tokensRemaining: number;
  phase: 'setup' | 'play';
  recommendation: Recommendation | null;
}

// --- Internal Types ---

interface Constraint {
  tiles: Set<string>; // set of "row,col" keys for hidden/uncertain tiles
  count: number; // number of Dipsters among those tiles
}

// --- Helper Functions ---

function tileKey(row: number, col: number): string {
  return `${row},${col}`;
}

function parseTileKey(key: string): { row: number; col: number } {
  const [row, col] = key.split(',').map(Number);
  return { row, col };
}

function cloneTile(tile: Tile): Tile {
  return { ...tile };
}

function cloneTiles(tiles: Tile[][]): Tile[][] {
  return tiles.map((row) => row.map((tile) => cloneTile(tile)));
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    tiles: cloneTiles(state.tiles),
  };
}

function getNeighbors(
  state: GameState,
  row: number,
  col: number
): Tile[] {
  const neighbors: Tile[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < state.rows && nc >= 0 && nc < state.cols) {
        neighbors.push(state.tiles[nr][nc]);
      }
    }
  }
  return neighbors;
}

function getCardinalNeighbors(
  state: GameState,
  row: number,
  col: number
): Tile[] {
  const neighbors: Tile[] = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of directions) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < state.rows && nc >= 0 && nc < state.cols) {
      neighbors.push(state.tiles[nr][nc]);
    }
  }
  return neighbors;
}

function isHiddenOrFlagged(tile: Tile): boolean {
  return tile.state === 'hidden' || tile.state === 'flagged';
}

function isKnownDipster(tile: Tile): boolean {
  return tile.state === 'dipster' || tile.state === 'zworaffe' || tile.state === 'flagged';
}

function countKnownDipstersInNeighbors(state: GameState, row: number, col: number): number {
  return getNeighbors(state, row, col).filter(isKnownDipster).length;
}

function getHiddenNeighborKeys(state: GameState, row: number, col: number): Set<string> {
  const keys = new Set<string>();
  for (const neighbor of getNeighbors(state, row, col)) {
    if (neighbor.state === 'hidden') {
      keys.add(tileKey(neighbor.row, neighbor.col));
    }
  }
  return keys;
}

// --- Exported Functions ---

/**
 * Creates a fresh game state with default tiles.
 */
export function createGameState(
  rows: number,
  cols: number,
  totalDipsters: number,
  tokens: number
): GameState {
  const tiles: Tile[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Tile[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        state: 'hidden',
        obstacle: 'none',
        digsRemaining: 0,
        revealedNumber: null,
        safety: 'uncertain',
        probability: totalDipsters / (rows * cols),
        isRecommended: false,
      });
    }
    tiles.push(row);
  }

  return {
    rows,
    cols,
    tiles,
    totalDipsters,
    foundDipsters: 0,
    tokensRemaining: tokens,
    phase: 'setup',
    recommendation: null,
  };
}

/**
 * Sets an obstacle on a tile (during setup phase).
 * Returns a new state without mutating the original.
 */
export function setObstacle(
  state: GameState,
  row: number,
  col: number,
  obstacle: ObstacleType
): GameState {
  const newState = cloneState(state);
  const tile = newState.tiles[row][col];
  tile.obstacle = obstacle;
  tile.digsRemaining = obstacle === 'small-rock' ? 2 : obstacle === 'broken-rock' ? 1 : 0;
  return newState;
}

/**
 * Reveals a tile with the given result.
 * - 'number': The tile shows a count of neighboring Dipsters.
 * - 'dipster': A Dipster was found on this tile.
 * - 'zworaffe': A Zworaffe (special Dipster) was found; reveals cardinal neighbors.
 * Returns a new state without mutating the original.
 */
export function revealTile(
  state: GameState,
  row: number,
  col: number,
  result: 'number' | 'dipster' | 'zworaffe',
  number?: number
): GameState {
  let newState = cloneState(state);
  newState.phase = 'play';
  const tile = newState.tiles[row][col];

  switch (result) {
    case 'number':
      tile.state = 'revealed';
      tile.revealedNumber = number ?? 0;
      tile.safety = 'no-dipster';
      tile.probability = 0;
      tile.obstacle = 'none';
      tile.digsRemaining = 0;
      tile.isRecommended = false;
      newState.tokensRemaining = Math.max(0, newState.tokensRemaining - 1);
      break;

    case 'dipster':
      tile.state = 'dipster';
      tile.safety = 'dipster';
      tile.probability = 1;
      tile.obstacle = 'none';
      tile.digsRemaining = 0;
      tile.isRecommended = false;
      newState.foundDipsters += 1;
      newState.tokensRemaining = Math.max(0, newState.tokensRemaining - 1);
      break;

    case 'zworaffe':
      tile.state = 'zworaffe';
      tile.safety = 'dipster';
      tile.probability = 1;
      tile.obstacle = 'none';
      tile.digsRemaining = 0;
      tile.isRecommended = false;
      newState.foundDipsters += 1;
      newState.tokensRemaining = Math.max(0, newState.tokensRemaining - 1);
      // Zworaffe reveals cardinal neighbors
      for (const neighbor of getCardinalNeighbors(newState, row, col)) {
        if (neighbor.state === 'hidden') {
          // Mark as revealed with number 0 as placeholder — the user should
          // update with the actual number if one is shown. For now, mark safe.
          neighbor.state = 'revealed';
          neighbor.revealedNumber = null;
          neighbor.safety = 'no-dipster';
          neighbor.probability = 0;
          neighbor.obstacle = 'none';
          neighbor.digsRemaining = 0;
          neighbor.isRecommended = false;
        }
      }
      break;
  }

  return solveConstraints(newState);
}

/**
 * Digs through an obstacle on a tile, reducing its dig count.
 * Returns a new state without mutating the original.
 */
export function digObstacle(state: GameState, row: number, col: number): GameState {
  const newState = cloneState(state);
  const tile = newState.tiles[row][col];

  if (tile.digsRemaining > 0) {
    tile.digsRemaining -= 1;
    if (tile.digsRemaining === 0) {
      tile.obstacle = 'none';
    } else if (tile.obstacle === 'small-rock') {
      tile.obstacle = 'broken-rock';
    }
    newState.tokensRemaining = Math.max(0, newState.tokensRemaining - 1);
  }

  return newState;
}

/**
 * Toggles a flag on a hidden tile (player's mark for suspected Dipster).
 * Returns a new state without mutating the original.
 */
export function toggleFlag(state: GameState, row: number, col: number): GameState {
  const newState = cloneState(state);
  const tile = newState.tiles[row][col];

  if (tile.state === 'hidden') {
    tile.state = 'flagged';
    tile.safety = 'dipster';
    tile.probability = 1;
    tile.isRecommended = false;
  } else if (tile.state === 'flagged') {
    tile.state = 'hidden';
    tile.safety = 'uncertain';
    tile.probability = 0.5;
    tile.isRecommended = false;
  }

  return solveConstraints(newState);
}

/**
 * Main constraint solver. Updates safety and probability for all hidden tiles.
 * Uses:
 * 1. Basic constraint propagation
 * 2. Set-based intersection reasoning
 * 3. Global probability distribution for remaining uncertain tiles
 * Returns a new state without mutating the original.
 */
export function solveConstraints(state: GameState): GameState {
  const newState = cloneState(state);

  // Reset safety/probability/recommendation for all hidden tiles before solving
  for (let r = 0; r < newState.rows; r++) {
    for (let c = 0; c < newState.cols; c++) {
      const tile = newState.tiles[r][c];
      if (tile.state === 'hidden') {
        tile.safety = 'uncertain';
        tile.probability = -1; // sentinel: not yet calculated
        tile.isRecommended = false;
      }
    }
  }
  newState.recommendation = null;

  // Phase 1 & 2: Iterative constraint propagation with set-based reasoning
  let changed = true;
  let iterations = 0;
  const maxIterations = 100; // prevent infinite loops

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;

    // Phase 1: Basic constraint propagation
    changed = basicPropagation(newState) || changed;

    // Phase 2: Set-based intersection reasoning
    if (!changed) {
      changed = setBasedReasoning(newState);
    }
  }

  // Phase 3: Probability calculation for remaining uncertain tiles
  calculateProbabilities(newState);

  // Phase 4: Pick recommended next dig
  calculateRecommendation(newState);

  return newState;
}

// Keep the old name as an alias for backward compatibility with the typo in the spec
export { solveConstraints as solvConstraints };

// --- Internal Solver Functions ---

/**
 * Basic constraint propagation.
 * For each revealed number tile:
 * - If known Dipsters == number, all hidden neighbors are safe.
 * - If hidden neighbors == (number - known Dipsters), all hidden neighbors are Dipsters.
 */
function basicPropagation(state: GameState): boolean {
  let changed = false;

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const tile = state.tiles[r][c];
      if (tile.state !== 'revealed' || tile.revealedNumber === null) continue;

      const number = tile.revealedNumber;
      const neighbors = getNeighbors(state, r, c);
      // Count confirmed Dipsters (found/flagged) AND deduced Dipsters (hidden but safety === 'dipster')
      const knownDipsters = neighbors.filter(isKnownDipster).length;
      const deducedDipsters = neighbors.filter(
        (n) => n.state === 'hidden' && n.safety === 'dipster'
      ).length;
      const totalAccountedDipsters = knownDipsters + deducedDipsters;
      // Hidden neighbors that are still uncertain (not yet deduced)
      const hiddenUncertainNeighbors = neighbors.filter(
        (n) => n.state === 'hidden' && n.safety === 'uncertain'
      );
      const remainingDipsters = number - totalAccountedDipsters;

      if (remainingDipsters < 0) continue; // inconsistent state, skip

      // All Dipsters found for this constraint — remaining hidden uncertain are no-dipster
      if (remainingDipsters === 0 && hiddenUncertainNeighbors.length > 0) {
        for (const hidden of hiddenUncertainNeighbors) {
          if (state.tiles[hidden.row][hidden.col].safety !== 'no-dipster') {
            state.tiles[hidden.row][hidden.col].safety = 'no-dipster';
            state.tiles[hidden.row][hidden.col].probability = 0;
            changed = true;
          }
        }
      }

      // All hidden uncertain neighbors must be Dipsters
      if (
        remainingDipsters > 0 &&
        hiddenUncertainNeighbors.length === remainingDipsters
      ) {
        for (const hidden of hiddenUncertainNeighbors) {
          if (state.tiles[hidden.row][hidden.col].safety !== 'dipster') {
            state.tiles[hidden.row][hidden.col].safety = 'dipster';
            state.tiles[hidden.row][hidden.col].probability = 1;
            changed = true;
          }
        }
      }
    }
  }

  return changed;
}

/**
 * Set-based intersection reasoning.
 * Compares constraints from pairs of numbered tiles that share hidden neighbors.
 * If constraint A's tiles are a subset of constraint B's tiles, we can deduce
 * information about tiles in B but not in A.
 */
function setBasedReasoning(state: GameState): boolean {
  let changed = false;
  const constraints = buildConstraints(state);

  // Compare all pairs of constraints
  for (let i = 0; i < constraints.length; i++) {
    for (let j = i + 1; j < constraints.length; j++) {
      const a = constraints[i];
      const b = constraints[j];

      // Check if A is a subset of B
      if (isSubset(a.tiles, b.tiles)) {
        changed = deduceFromSubset(state, a, b) || changed;
      }
      // Check if B is a subset of A
      else if (isSubset(b.tiles, a.tiles)) {
        changed = deduceFromSubset(state, b, a) || changed;
      }
    }
  }

  return changed;
}

/**
 * Builds constraints from all revealed number tiles.
 * Each constraint tracks the set of hidden uncertain neighbor tiles
 * and how many Dipsters remain among them.
 */
function buildConstraints(state: GameState): Constraint[] {
  const constraints: Constraint[] = [];

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const tile = state.tiles[r][c];
      if (tile.state !== 'revealed' || tile.revealedNumber === null) continue;

      const neighbors = getNeighbors(state, r, c);
      const knownDipsters = neighbors.filter(isKnownDipster).length;
      const remainingCount = tile.revealedNumber - knownDipsters;

      // Only include hidden tiles that are still uncertain
      const hiddenKeys = new Set<string>();
      for (const n of neighbors) {
        if (n.state === 'hidden' && n.safety === 'uncertain') {
          hiddenKeys.add(tileKey(n.row, n.col));
        }
      }

      // Also account for tiles already deduced as dipster in this round
      let deducedDipsters = 0;
      for (const n of neighbors) {
        if (n.state === 'hidden' && n.safety === 'dipster') {
          deducedDipsters++;
        }
      }

      const adjustedCount = remainingCount - deducedDipsters;

      if (hiddenKeys.size > 0 && adjustedCount >= 0) {
        constraints.push({ tiles: hiddenKeys, count: adjustedCount });
      }
    }
  }

  return constraints;
}

/**
 * Given that subset's tiles ⊆ superset's tiles, deduce information about
 * tiles that are in superset but not in subset.
 * The difference tiles must contain exactly (superset.count - subset.count) Dipsters.
 */
function deduceFromSubset(
  state: GameState,
  subset: Constraint,
  superset: Constraint
): boolean {
  let changed = false;
  const difference = setDifference(superset.tiles, subset.tiles);
  const diffCount = superset.count - subset.count;

  if (diffCount < 0) return false; // inconsistent

  // If difference must have 0 Dipsters, all are safe
  if (diffCount === 0) {
    Array.from(difference).forEach((key) => {
      const { row, col } = parseTileKey(key);
      const tile = state.tiles[row][col];
      if (tile.safety !== 'no-dipster') {
        tile.safety = 'no-dipster';
        tile.probability = 0;
        changed = true;
      }
    });
  }

  // If difference tiles == diffCount, all must be Dipsters
  if (diffCount > 0 && difference.size === diffCount) {
    Array.from(difference).forEach((key) => {
      const { row, col } = parseTileKey(key);
      const tile = state.tiles[row][col];
      if (tile.safety !== 'dipster') {
        tile.safety = 'dipster';
        tile.probability = 1;
        changed = true;
      }
    });
  }

  return changed;
}

/**
 * Calculate probabilities for remaining uncertain tiles using global constraints.
 * Distributes remaining Dipsters among uncertain tiles, weighted by local constraint participation.
 */
function calculateProbabilities(state: GameState): void {
  const remainingDipsters = state.totalDipsters - state.foundDipsters;

  // Count tiles already determined as dipsters (by solver deduction, not yet "found")
  let deducedDipsters = 0;
  const uncertainTiles: Tile[] = [];

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const tile = state.tiles[r][c];
      if (tile.state === 'hidden') {
        if (tile.safety === 'dipster') {
          deducedDipsters++;
          tile.probability = 1;
        } else if (tile.safety === 'no-dipster') {
          tile.probability = 0;
        } else if (tile.safety === 'uncertain') {
          uncertainTiles.push(tile);
        }
      }
    }
  }

  // Also count flagged tiles as "accounted for" Dipsters
  let flaggedCount = 0;
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      if (state.tiles[r][c].state === 'flagged') {
        flaggedCount++;
      }
    }
  }

  const unaccountedDipsters = remainingDipsters - deducedDipsters - flaggedCount;

  if (uncertainTiles.length === 0) return;

  if (unaccountedDipsters <= 0) {
    // All Dipsters are accounted for — remaining uncertain tiles cannot have Dipsters
    for (const tile of uncertainTiles) {
      tile.safety = 'no-dipster';
      tile.probability = 0;
    }
    return;
  }

  if (unaccountedDipsters >= uncertainTiles.length) {
    // More Dipsters than uncertain tiles — all must be Dipsters
    for (const tile of uncertainTiles) {
      tile.safety = 'dipster';
      tile.probability = 1;
    }
    return;
  }

  // Calculate weighted probabilities based on local constraint participation
  const constraintWeights = calculateConstraintWeights(state, uncertainTiles);
  const baseProbability = unaccountedDipsters / uncertainTiles.length;

  for (const tile of uncertainTiles) {
    const key = tileKey(tile.row, tile.col);
    const weight = constraintWeights.get(key) ?? 1;
    // Weighted probability: tiles involved in more constraints get adjusted probability
    // Weight > 1 means the tile is more constrained, pushing probability toward local estimates
    tile.probability = Math.min(1, Math.max(0, baseProbability * weight));
  }

  // Normalize probabilities so they sum to the expected number of unaccounted Dipsters
  const totalProb = uncertainTiles.reduce((sum, t) => sum + t.probability, 0);
  if (totalProb > 0) {
    const scale = unaccountedDipsters / totalProb;
    for (const tile of uncertainTiles) {
      tile.probability = Math.min(1, Math.max(0, tile.probability * scale));
    }
  }
}

/**
 * Calculates relative weights for uncertain tiles based on how many
 * local constraints they participate in and the local density implied by those constraints.
 */
function calculateConstraintWeights(
  state: GameState,
  uncertainTiles: Tile[]
): Map<string, number> {
  const weights = new Map<string, number>();
  const localEstimates = new Map<string, number[]>();

  // Initialize
  for (const tile of uncertainTiles) {
    const key = tileKey(tile.row, tile.col);
    weights.set(key, 1);
    localEstimates.set(key, []);
  }

  // For each constraint (revealed number), calculate the local Dipster density
  // among the uncertain tiles it affects
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const tile = state.tiles[r][c];
      if (tile.state !== 'revealed' || tile.revealedNumber === null) continue;

      const neighbors = getNeighbors(state, r, c);
      const knownDipsters = neighbors.filter(isKnownDipster).length;
      const deducedDipsters = neighbors.filter(
        (n) => n.state === 'hidden' && n.safety === 'dipster'
      ).length;
      const remainingCount = tile.revealedNumber - knownDipsters - deducedDipsters;

      const uncertainNeighbors = neighbors.filter(
        (n) => n.state === 'hidden' && n.safety === 'uncertain'
      );

      if (uncertainNeighbors.length > 0 && remainingCount >= 0) {
        const localDensity = remainingCount / uncertainNeighbors.length;
        for (const n of uncertainNeighbors) {
          const key = tileKey(n.row, n.col);
          const estimates = localEstimates.get(key);
          if (estimates) {
            estimates.push(localDensity);
          }
        }
      }
    }
  }

  // Compute weight as average local density relative to global base
  for (const tile of uncertainTiles) {
    const key = tileKey(tile.row, tile.col);
    const estimates = localEstimates.get(key) ?? [];
    if (estimates.length > 0) {
      const avgDensity = estimates.reduce((a, b) => a + b, 0) / estimates.length;
      // Use density as relative weight (higher density = higher probability)
      // Clamp between 0.1 and 10 to avoid extreme values
      weights.set(key, Math.max(0.1, Math.min(10, avgDensity / 0.5)));
    }
  }

  return weights;
}

/**
 * Picks the best tile(s) to dig next, optimizing for minimum token usage.
 * Highlights ALL tiles tied at the best probability/category.
 * Priority:
 * 1. Guaranteed Dipster — 100% chance, best token value
 * 2. Highest probability uncertain tile(s) — most likely to find a Dipster
 * 3. Info dig (cannot have Dipster) — only when no good probability leads exist
 */
function calculateRecommendation(state: GameState): void {
  // Priority 1: Guaranteed Dipsters (without obstacle blocking)
  const guaranteedClear: Tile[] = [];
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const tile = state.tiles[r][c];
      if (tile.state === 'hidden' && tile.safety === 'dipster' && tile.digsRemaining === 0) {
        guaranteedClear.push(tile);
      }
    }
  }

  if (guaranteedClear.length > 0) {
    for (const tile of guaranteedClear) {
      tile.isRecommended = true;
    }
    state.recommendation = {
      row: guaranteedClear[0].row,
      col: guaranteedClear[0].col,
      reason: guaranteedClear.length === 1
        ? 'Guaranteed Dipster — dig it!'
        : `${guaranteedClear.length} guaranteed Dipsters — dig any!`,
    };
    return;
  }

  // Priority 1b: Guaranteed Dipsters behind obstacles
  const guaranteedObstacle: Tile[] = [];
  let lowestDigCost = Infinity;
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const tile = state.tiles[r][c];
      if (tile.state === 'hidden' && tile.safety === 'dipster' && tile.digsRemaining > 0) {
        if (tile.digsRemaining < lowestDigCost) {
          lowestDigCost = tile.digsRemaining;
          guaranteedObstacle.length = 0;
          guaranteedObstacle.push(tile);
        } else if (tile.digsRemaining === lowestDigCost) {
          guaranteedObstacle.push(tile);
        }
      }
    }
  }

  // Priority 2: Highest probability uncertain tiles (clear of obstacles)
  let bestProb = -1;
  const bestProbTiles: Tile[] = [];
  let bestProbObstacle = -1;
  const bestProbObstacleTiles: Tile[] = [];

  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const tile = state.tiles[r][c];
      if (tile.state !== 'hidden' || tile.safety !== 'uncertain') continue;
      if (tile.digsRemaining === 0) {
        const prob = Math.round(tile.probability * 100);
        if (prob > bestProb) {
          bestProb = prob;
          bestProbTiles.length = 0;
          bestProbTiles.push(tile);
        } else if (prob === bestProb) {
          bestProbTiles.push(tile);
        }
      } else {
        const effectiveProb = Math.round((tile.probability / (tile.digsRemaining + 1)) * 100);
        if (effectiveProb > bestProbObstacle) {
          bestProbObstacle = effectiveProb;
          bestProbObstacleTiles.length = 0;
          bestProbObstacleTiles.push(tile);
        } else if (effectiveProb === bestProbObstacle) {
          bestProbObstacleTiles.push(tile);
        }
      }
    }
  }

  // Compare guaranteed obstacle Dipster vs best probability tiles
  if (guaranteedObstacle.length > 0) {
    const guaranteedCost = lowestDigCost + 1;
    if (bestProbTiles.length === 0 || bestProb < Math.round((1 / guaranteedCost) * 100)) {
      for (const tile of guaranteedObstacle) {
        tile.isRecommended = true;
      }
      state.recommendation = {
        row: guaranteedObstacle[0].row,
        col: guaranteedObstacle[0].col,
        reason: guaranteedObstacle.length === 1
          ? `Guaranteed Dipster behind rock (${guaranteedCost} tokens)`
          : `${guaranteedObstacle.length} guaranteed Dipsters behind rock (${guaranteedCost} tokens each)`,
      };
      return;
    }
  }

  // Pick best probability tiles if good bet (>= 40% or no info alternatives)
  if (bestProbTiles.length > 0 && bestProb >= 40) {
    for (const tile of bestProbTiles) {
      tile.isRecommended = true;
    }
    state.recommendation = {
      row: bestProbTiles[0].row,
      col: bestProbTiles[0].col,
      reason: bestProbTiles.length === 1
        ? `High chance of Dipster (${bestProb}%)`
        : `${bestProbTiles.length} tiles tied at ${bestProb}% — pick any`,
    };
    return;
  }

  // Priority 3: Info dig — "cannot have Dipster" tile with most uncertain neighbors
  let bestInfoScore = -1;
  const bestInfoTiles: Tile[] = [];
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const tile = state.tiles[r][c];
      if (tile.state !== 'hidden' || tile.safety !== 'no-dipster' || tile.digsRemaining > 0) continue;
      const score = getNeighbors(state, r, c).filter(
        (n) => n.state === 'hidden' && n.safety === 'uncertain'
      ).length;
      if (score > bestInfoScore) {
        bestInfoScore = score;
        bestInfoTiles.length = 0;
        bestInfoTiles.push(tile);
      } else if (score === bestInfoScore) {
        bestInfoTiles.push(tile);
      }
    }
  }

  // If info dig is promising (3+ uncertain neighbors) and probability is low
  if (bestInfoTiles.length > 0 && bestInfoScore >= 3 && bestProb < 40) {
    for (const tile of bestInfoTiles) {
      tile.isRecommended = true;
    }
    state.recommendation = {
      row: bestInfoTiles[0].row,
      col: bestInfoTiles[0].col,
      reason: bestInfoTiles.length === 1
        ? `Info dig — may unlock ${bestInfoScore} tiles (best odds elsewhere: ${bestProb}%)`
        : `${bestInfoTiles.length} info digs — each may unlock ${bestInfoScore} tiles`,
    };
    return;
  }

  // Otherwise go for best probability tiles even if < 40%
  if (bestProbTiles.length > 0) {
    for (const tile of bestProbTiles) {
      tile.isRecommended = true;
    }
    state.recommendation = {
      row: bestProbTiles[0].row,
      col: bestProbTiles[0].col,
      reason: bestProbTiles.length === 1
        ? `Best chance of Dipster (${bestProb}%)`
        : `${bestProbTiles.length} tiles tied at ${bestProb}% — pick any`,
    };
    return;
  }

  // Fallback: obstacle probability tiles
  if (bestProbObstacleTiles.length > 0) {
    for (const tile of bestProbObstacleTiles) {
      tile.isRecommended = true;
    }
    state.recommendation = {
      row: bestProbObstacleTiles[0].row,
      col: bestProbObstacleTiles[0].col,
      reason: `Best chance behind rock (${Math.round(bestProbObstacleTiles[0].probability * 100)}%)`,
    };
    return;
  }

  // Last resort: any info tile
  if (bestInfoTiles.length > 0) {
    for (const tile of bestInfoTiles) {
      tile.isRecommended = true;
    }
    state.recommendation = {
      row: bestInfoTiles[0].row,
      col: bestInfoTiles[0].col,
      reason: 'Info dig — no better options available',
    };
    return;
  }
}

// --- Set Utility Functions ---

function isSubset(a: Set<string>, b: Set<string>): boolean {
  if (a.size > b.size) return false;
  const items = Array.from(a);
  for (let i = 0; i < items.length; i++) {
    if (!b.has(items[i])) return false;
  }
  return true;
}

function setDifference(a: Set<string>, b: Set<string>): Set<string> {
  const diff = new Set<string>();
  Array.from(a).forEach((item) => {
    if (!b.has(item)) {
      diff.add(item);
    }
  });
  return diff;
}
