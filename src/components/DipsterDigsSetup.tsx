"use client";

import { useState } from "react";
import type { GameState, ObstacleType } from "@/lib/dipster-solver";

interface DipsterDigsSetupProps {
  rows: number;
  cols: number;
  totalDipsters: number;
  tokens: number;
  gameState: GameState | null;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  onTotalDipstersChange: (total: number) => void;
  onTokensChange: (tokens: number) => void;
  onCreateGrid: () => void;
  onSetObstacle: (row: number, col: number, obstacle: ObstacleType) => void;
  onStartGame: () => void;
}

export function DipsterDigsSetup({
  rows,
  cols,
  totalDipsters,
  tokens,
  gameState,
  onRowsChange,
  onColsChange,
  onTotalDipstersChange,
  onTokensChange,
  onCreateGrid,
  onSetObstacle,
  onStartGame,
}: DipsterDigsSetupProps) {
  // Local string state for inputs so users can freely type/delete
  const [rowsStr, setRowsStr] = useState(String(rows));
  const [colsStr, setColsStr] = useState(String(cols));
  const [dipstersStr, setDipstersStr] = useState(String(totalDipsters));
  const [tokensStr, setTokensStr] = useState(String(tokens));

  const clamp = (val: string, min: number, max: number, fallback: number): number => {
    const n = parseInt(val);
    if (isNaN(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  };

  const cycleObstacle = (row: number, col: number) => {
    if (!gameState) return;
    const current = gameState.tiles[row][col].obstacle;
    const next: ObstacleType =
      current === "none"
        ? "broken-rock"
        : current === "broken-rock"
          ? "small-rock"
          : "none";
    onSetObstacle(row, col, next);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">How to Use</h3>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Set the grid dimensions to match your in-game board</li>
          <li>Enter the number of Dipsters to find and your token budget</li>
          <li>Click &ldquo;Create Grid&rdquo; to generate the board</li>
          <li>Click tiles to place obstacles (cycles: none → broken rock → small rock → none)</li>
          <li>Click &ldquo;Start Game&rdquo; when your board matches the in-game layout</li>
        </ol>
      </div>

      {/* Grid config inputs */}
      <div className="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Board Setup</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="rows-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rows
            </label>
            <input
              id="rows-input"
              type="number"
              min={2}
              max={12}
              value={rowsStr}
              onChange={(e) => setRowsStr(e.target.value)}
              onBlur={() => {
                const v = clamp(rowsStr, 2, 12, 5);
                setRowsStr(String(v));
                onRowsChange(v);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="cols-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Columns
            </label>
            <input
              id="cols-input"
              type="number"
              min={2}
              max={12}
              value={colsStr}
              onChange={(e) => setColsStr(e.target.value)}
              onBlur={() => {
                const v = clamp(colsStr, 2, 12, 5);
                setColsStr(String(v));
                onColsChange(v);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="dipsters-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Dipsters
            </label>
            <input
              id="dipsters-input"
              type="number"
              min={1}
              max={rows * cols}
              value={dipstersStr}
              onChange={(e) => setDipstersStr(e.target.value)}
              onBlur={() => {
                const v = clamp(dipstersStr, 1, rows * cols, 3);
                setDipstersStr(String(v));
                onTotalDipstersChange(v);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="tokens-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tokens
            </label>
            <input
              id="tokens-input"
              type="number"
              min={1}
              max={99}
              value={tokensStr}
              onChange={(e) => setTokensStr(e.target.value)}
              onBlur={() => {
                const v = clamp(tokensStr, 1, 99, 15);
                setTokensStr(String(v));
                onTokensChange(v);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <button
          onClick={onCreateGrid}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Grid
        </button>
      </div>

      {/* Grid for obstacle placement */}
      {gameState && (
        <div className="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">
            Place Obstacles
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Click tiles to cycle through obstacle types. Match your in-game board.
          </p>

          <div className="overflow-x-auto">
            <div
              className="grid gap-1 w-fit mx-auto"
              style={{
                gridTemplateColumns: `repeat(${gameState.cols}, minmax(0, 1fr))`,
              }}
            >
              {gameState.tiles.flat().map((tile) => (
                <button
                  key={`${tile.row}-${tile.col}`}
                  onClick={() => cycleObstacle(tile.row, tile.col)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded border-2 text-xs font-bold flex items-center justify-center transition-colors ${
                    tile.obstacle === "none"
                      ? "bg-amber-50 border-amber-200 hover:bg-amber-100"
                      : tile.obstacle === "broken-rock"
                        ? "bg-stone-300 border-stone-400 text-stone-700 hover:bg-stone-400"
                        : "bg-stone-500 border-stone-600 text-white hover:bg-stone-600"
                  }`}
                  aria-label={`Row ${tile.row + 1}, Column ${tile.col + 1}: ${tile.obstacle === "none" ? "empty" : tile.obstacle}`}
                >
                  {tile.obstacle === "none" && ""}
                  {tile.obstacle === "broken-rock" && "🪨"}
                  {tile.obstacle === "small-rock" && "🪨🪨"}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-amber-50 border border-amber-200 inline-block" />
              Empty
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-stone-300 border border-stone-400 inline-block" />
              Broken Rock (1 dig)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-stone-500 border border-stone-600 inline-block" />
              Small Rock (2 digs)
            </span>
          </div>

          <button
            onClick={onStartGame}
            className="mt-4 px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Start Game →
          </button>
        </div>
      )}
    </div>
  );
}
