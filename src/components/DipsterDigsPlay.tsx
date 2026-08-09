"use client";

import { useState } from "react";
import type { GameState, Tile } from "@/lib/dipster-solver";

interface DipsterDigsPlayProps {
  gameState: GameState;
  onRevealTile: (
    row: number,
    col: number,
    result: "number" | "dipster" | "zworaffe",
    number?: number
  ) => void;
  onDigObstacle: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
  onReset: () => void;
}

type ActionMode = "reveal" | "flag";

export function DipsterDigsPlay({
  gameState,
  onRevealTile,
  onDigObstacle,
  onToggleFlag,
  onReset,
}: DipsterDigsPlayProps) {
  const [actionMode, setActionMode] = useState<ActionMode>("reveal");
  const [selectedTile, setSelectedTile] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [revealNumber, setRevealNumber] = useState(0);

  const remainingDipsters = gameState.totalDipsters - gameState.foundDipsters;
  const allFound = remainingDipsters <= 0;

  const handleTileClick = (tile: Tile) => {
    // Can't interact with already revealed tiles
    if (tile.state === "revealed" || tile.state === "dipster" || tile.state === "zworaffe") {
      return;
    }

    if (actionMode === "flag") {
      onToggleFlag(tile.row, tile.col);
      return;
    }

    // If obstacle needs digging first
    if (tile.digsRemaining > 0) {
      onDigObstacle(tile.row, tile.col);
      return;
    }

    // Open reveal dialog
    setSelectedTile({ row: tile.row, col: tile.col });
    setRevealNumber(0);
  };

  const handleRevealConfirm = (result: "number" | "dipster" | "zworaffe") => {
    if (!selectedTile) return;
    onRevealTile(
      selectedTile.row,
      selectedTile.col,
      result,
      result === "number" ? revealNumber : undefined
    );
    setSelectedTile(null);
    setRevealNumber(0);
  };

  const handleCancelReveal = () => {
    setSelectedTile(null);
    setRevealNumber(0);
  };

  const getTileDisplay = (tile: Tile) => {
    switch (tile.state) {
      case "revealed":
        return tile.revealedNumber !== null
          ? tile.revealedNumber.toString()
          : "·";
      case "dipster":
        return "🎵";
      case "zworaffe":
        return "🦒";
      case "flagged":
        return "🚩";
      case "hidden":
        if (tile.digsRemaining === 2) return "🪨🪨";
        if (tile.digsRemaining === 1) return "🪨";
        return "";
    }
  };

  const getTileStyle = (tile: Tile): string => {
    // Base style
    const base = "w-10 h-10 sm:w-12 sm:h-12 rounded border-2 text-xs font-bold flex items-center justify-center transition-all relative";

    if (tile.state === "revealed") {
      return `${base} bg-white border-gray-200 text-gray-700 cursor-default`;
    }
    if (tile.state === "dipster" || tile.state === "zworaffe") {
      return `${base} bg-green-100 border-green-400 cursor-default`;
    }
    if (tile.state === "flagged") {
      return `${base} bg-red-100 border-red-300 cursor-pointer hover:bg-red-200`;
    }

    // Recommended tile gets a prominent ring
    const recommended = tile.isRecommended ? " ring-2 ring-indigo-500 ring-offset-1" : "";

    // Hidden tiles — color by safety
    if (tile.safety === "no-dipster") {
      return `${base} bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100${recommended}`;
    }
    if (tile.safety === "dipster") {
      return `${base} bg-green-200 border-green-400 cursor-pointer hover:bg-green-300 ring-2 ring-green-500 ring-opacity-50`;
    }

    // Uncertain — gradient by probability
    if (tile.probability >= 0.7) {
      return `${base} bg-orange-200 border-orange-400 cursor-pointer hover:bg-orange-300${recommended}`;
    }
    if (tile.probability >= 0.4) {
      return `${base} bg-yellow-100 border-yellow-300 cursor-pointer hover:bg-yellow-200${recommended}`;
    }
    return `${base} bg-amber-50 border-amber-200 cursor-pointer hover:bg-amber-100${recommended}`;
  };

  const getNumberColor = (num: number): string => {
    const colors = [
      "text-gray-400", // 0
      "text-blue-600", // 1
      "text-green-600", // 2
      "text-red-600", // 3
      "text-purple-700", // 4
      "text-red-800", // 5
      "text-cyan-600", // 6
      "text-gray-900", // 7
      "text-gray-900", // 8
    ];
    return colors[num] ?? "text-gray-900";
  };

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Dipsters</p>
            <p className="text-lg font-bold text-gray-900">
              {gameState.foundDipsters}/{gameState.totalDipsters}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Remaining</p>
            <p className="text-lg font-bold text-indigo-600">{remainingDipsters}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Tokens</p>
            <p className={`text-lg font-bold ${gameState.tokensRemaining <= 3 ? "text-red-600" : "text-gray-900"}`}>
              {gameState.tokensRemaining}
            </p>
          </div>
          <div className="flex-1" />
          <div className="flex gap-2">
            <button
              onClick={() => setActionMode("reveal")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                actionMode === "reveal"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⛏️ Dig
            </button>
            <button
              onClick={() => setActionMode("flag")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                actionMode === "flag"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🚩 Flag
            </button>
          </div>
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Success message */}
      {allFound && (
        <div className="rounded-lg p-4 bg-green-50 border border-green-200 text-green-800 font-medium text-center">
          🎉 All Dipsters found! Level complete!
        </div>
      )}

      {/* Recommendation banner */}
      {!allFound && gameState.recommendation && (
        <div className="rounded-lg p-3 bg-indigo-50 border border-indigo-200 flex items-center gap-3">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-sm font-medium text-indigo-900">
              Recommended: Dig ({gameState.recommendation.row + 1}, {gameState.recommendation.col + 1})
            </p>
            <p className="text-xs text-indigo-700">
              {gameState.recommendation.reason}
            </p>
          </div>
        </div>
      )}

      {/* Game grid */}
      <div className="rounded-lg p-4 bg-white shadow-sm border border-gray-200">
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
                onClick={() => handleTileClick(tile)}
                className={getTileStyle(tile)}
                aria-label={`Row ${tile.row + 1}, Column ${tile.col + 1}: ${tile.state}${tile.state === "hidden" ? ` (${Math.round(tile.probability * 100)}% chance)` : ""}`}
                disabled={
                  tile.state === "revealed" ||
                  tile.state === "dipster" ||
                  tile.state === "zworaffe"
                }
              >
                <span
                  className={
                    tile.state === "revealed" && tile.revealedNumber !== null
                      ? getNumberColor(tile.revealedNumber)
                      : ""
                  }
                >
                  {getTileDisplay(tile)}
                </span>
                {/* Show probability on uncertain hidden tiles */}
                {tile.state === "hidden" &&
                  tile.safety === "uncertain" &&
                  tile.digsRemaining === 0 &&
                  tile.probability > 0 && (
                    <span className="absolute bottom-0 right-0 text-[8px] text-gray-500 leading-none p-0.5">
                      {Math.round(tile.probability * 100)}
                    </span>
                  )}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-50 border border-blue-200 inline-block" />
            Cannot Have Dipster
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-200 border border-green-400 inline-block" />
            Guaranteed Dipster
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300 inline-block" />
            Uncertain
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-orange-200 border border-orange-400 inline-block" />
            Likely Dipster
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded ring-2 ring-indigo-500 ring-offset-1 bg-white border border-gray-200 inline-block" />
            Recommended
          </span>
        </div>
      </div>

      {/* Reveal dialog */}
      {selectedTile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg p-6 bg-white shadow-xl border border-gray-200 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-gray-900">
              What did you find at ({selectedTile.row + 1}, {selectedTile.col + 1})?
            </h3>

            {/* Number result */}
            <div className="space-y-2">
              <label htmlFor="reveal-number" className="block text-sm font-medium text-gray-700">
                Number (neighboring Dipsters):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="reveal-number"
                  type="number"
                  min={0}
                  max={8}
                  value={revealNumber}
                  onChange={(e) =>
                    setRevealNumber(e.target.value === "" ? 0 : parseInt(e.target.value))
                  }
                  onBlur={(e) =>
                    setRevealNumber(Math.max(0, Math.min(8, parseInt(e.target.value) || 0)))
                  }
                  className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleRevealConfirm("number")}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Reveal Number
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 flex flex-col gap-2">
              <button
                onClick={() => handleRevealConfirm("dipster")}
                className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                🎵 Found a Dipster!
              </button>
              <button
                onClick={() => handleRevealConfirm("zworaffe")}
                className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
              >
                🦒 Found a Zworaffe!
              </button>
            </div>

            <button
              onClick={handleCancelReveal}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
