import { useGame } from '../../context/GameContext'
import Cell from './Cell'

export default function Grid() {
  const { gameState, loading } = useGame()
  const grid = gameState?.grid

  return (
    <div className="flex flex-col gap-3 lg:gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-linear-to-b from-indigo-400 to-cyan-400" />
          <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
            Exploration Grid
          </span>
        </div>
        {grid && (
          <span className="text-xs px-3 py-1 rounded-full font-mono bg-slate-800 text-slate-400 border border-slate-700">
            {grid.length} × {grid[0]?.length}
          </span>
        )}
      </div>

      {/* Loading pulse */}
      {loading && (
        <div className="text-center py-2 px-4 rounded-lg text-xs lg:text-sm
                        text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 animate-pulse">
          ⚙️ Processing inference engine...
        </div>
      )}

      {/* Game Over banner */}
      {gameState?.alive === false && (
        <div className="animate-slide-in text-center py-2 lg:py-3 rounded-xl font-bold text-sm
                        text-red-400 bg-red-500/10 border border-red-500/30">
          💀 Agent Eliminated — Mission Failed
        </div>
      )}

      {/* Gold Found banner */}
      {gameState?.percepts?.glitter && (
        <div className="animate-slide-in text-center py-2 lg:py-3 rounded-xl font-bold text-sm
                        text-amber-400 bg-amber-500/10 border border-amber-500/30">
          🏆 Gold Located — Mission Success!
        </div>
      )}

      {/* Empty State */}
      {!grid ? (
        <div className="flex flex-col items-center justify-center rounded-2xl
                        border-2 border-dashed border-slate-700 bg-slate-900/50
                        min-h-64 lg:min-h-96 gap-4 animate-float">
          <span className="text-4xl lg:text-6xl">🗺️</span>
          <div className="text-center">
            <p className="text-slate-400 font-medium text-sm lg:text-base">No Active Mission</p>
            <p className="text-slate-600 text-xs lg:text-sm mt-1">Configure grid and launch a new mission</p>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Grid Container */
        <div className="p-3 lg:p-4 rounded-2xl bg-slate-900 dark:bg-slate-900 border border-slate-800 dark:border-slate-800 animate-grid-in">
          <div
            className="grid gap-1.5 lg:gap-2"
            style={{ gridTemplateColumns: `repeat(${grid[0]?.length}, 1fr)` }}
          >
            {grid.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <Cell
                  key={`${rowIdx}-${colIdx}`}
                  cell={cell}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                />
              ))
            )}
          </div>

          {/* Grid footer */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-600 tracking-widest">KB ENGINE v1.0</span>
            <span className="text-[10px] font-mono text-slate-600">
              {grid.flat().filter(c => c.visited).length}/{grid.flat().length} EXPLORED
            </span>
          </div>
        </div>
      )}
    </div>
  )
}