"use client";

import { useState, useCallback } from "react";
import type { GameState, ObstacleType } from "@/lib/dipster-solver";
import {
  createGameState,
  setObstacle,
  revealTile,
  digObstacle,
  toggleFlag,
  solveConstraints,
} from "@/lib/dipster-solver";
import { DipsterDigsSetup } from "./DipsterDigsSetup";
import { DipsterDigsPlay } from "./DipsterDigsPlay";
import { DipsterDigsHowItWorks } from "./DipsterDigsHowItWorks";

export function DipsterDigs() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [phase, setPhase] = useState<"setup" | "play">("setup");
  const [activeTab, setActiveTab] = useState<"solver" | "how">("solver");

  // Setup config state
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [totalDipsters, setTotalDipsters] = useState(3);
  const [tokens, setTokens] = useState(15);

  // Initialize blank grid for setup
  const handleCreateGrid = useCallback(() => {
    const state = createGameState(rows, cols, totalDipsters, tokens);
    setGameState(state);
  }, [rows, cols, totalDipsters, tokens]);

  // Toggle obstacle during setup
  const handleSetObstacle = useCallback(
    (row: number, col: number, obstacle: ObstacleType) => {
      if (!gameState) return;
      setGameState(setObstacle(gameState, row, col, obstacle));
    },
    [gameState]
  );

  // Start the game
  const handleStartGame = useCallback(() => {
    if (!gameState) return;
    const playState: GameState = { ...gameState, phase: "play" };
    setGameState(solveConstraints(playState));
    setPhase("play");
  }, [gameState]);

  // Reveal a tile during play
  const handleRevealTile = useCallback(
    (
      row: number,
      col: number,
      result: "number" | "dipster" | "zworaffe",
      number?: number
    ) => {
      if (!gameState) return;
      setGameState(revealTile(gameState, row, col, result, number));
    },
    [gameState]
  );

  // Dig an obstacle during play
  const handleDigObstacle = useCallback(
    (row: number, col: number) => {
      if (!gameState) return;
      setGameState(digObstacle(gameState, row, col));
    },
    [gameState]
  );

  // Toggle flag during play
  const handleToggleFlag = useCallback(
    (row: number, col: number) => {
      if (!gameState) return;
      setGameState(toggleFlag(gameState, row, col));
    },
    [gameState]
  );

  // Reset to setup
  const handleReset = useCallback(() => {
    setGameState(null);
    setPhase("setup");
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <a
          href="/msm-lookup"
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← Home
        </a>
        <h2 className="text-2xl font-bold text-gray-900">Dipster Digs Solver</h2>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 flex items-start gap-2">
        <span className="text-amber-600 font-bold text-lg leading-none mt-0.5">!</span>
        <p className="text-sm text-amber-800">
          This solver does not compute a guaranteed least-cost solution. It provides the
          best <strong>approximate</strong> next move based on constraint analysis and
          probability estimation. Results are heuristic, not optimal.
        </p>
      </div>

      {/* Subtabs */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("solver")}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
            activeTab === "solver"
              ? "bg-white border border-b-white border-gray-200 -mb-px text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Solver
        </button>
        <button
          onClick={() => setActiveTab("how")}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
            activeTab === "how"
              ? "bg-white border border-b-white border-gray-200 -mb-px text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          How This Is Calculated
        </button>
      </div>

      {activeTab === "solver" && (
        <>
          {phase === "setup" ? (
            <DipsterDigsSetup
              rows={rows}
              cols={cols}
              totalDipsters={totalDipsters}
              tokens={tokens}
              gameState={gameState}
              onRowsChange={setRows}
              onColsChange={setCols}
              onTotalDipstersChange={setTotalDipsters}
              onTokensChange={setTokens}
              onCreateGrid={handleCreateGrid}
              onSetObstacle={handleSetObstacle}
              onStartGame={handleStartGame}
            />
          ) : gameState ? (
            <DipsterDigsPlay
              gameState={gameState}
              onRevealTile={handleRevealTile}
              onDigObstacle={handleDigObstacle}
              onToggleFlag={handleToggleFlag}
              onReset={handleReset}
            />
          ) : null}
        </>
      )}

      {activeTab === "how" && <DipsterDigsHowItWorks />}
    </div>
  );
}
