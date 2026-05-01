import { useGame } from '../../context/GameContext'

export default function Controls() {
  const { rows, setRows, cols, setCols, startNewGame, autoMove, loading, gameState } = useGame()

  const isGameOver = gameState?.alive === false
  const canAutoMove = !!gameState && !loading && !isGameOver

  return (
    <div className="rounded-2xl bg-slate-900 dark:bg-slate-900 border border-slate-800 dark:border-slate-800 p-3 lg:p-5 flex flex-col gap-3 lg:gap-5">

      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-linear-to-b from-indigo-400 to-cyan-400" />
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
          Mission Control
        </span>
      </div>

      {/* Grid Size Inputs */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-slate-500 font-medium">Grid Dimensions</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">Rows</label>
            <input
              id="grid-rows-input"
              type="number"
              min={2}
              max={10}
              value={rows}
              onChange={e => setRows(Math.max(2, Math.min(10, Number(e.target.value))))}
              className="w-full px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg font-mono text-sm
                         bg-slate-800 dark:bg-slate-800
                         border border-slate-700 dark:border-slate-700
                         text-slate-100 dark:text-slate-100
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-transparent transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">Cols</label>
            <input
              id="grid-cols-input"
              type="number"
              min={2}
              max={10}
              value={cols}
              onChange={e => setCols(Math.max(2, Math.min(10, Number(e.target.value))))}
              className="w-full px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg font-mono text-sm
                         bg-slate-800 dark:bg-slate-800
                         border border-slate-700 dark:border-slate-700
                         text-slate-100 dark:text-slate-100
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-800" />

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 lg:gap-3">
        <button
          id="new-game-btn"
          onClick={startNewGame}
          disabled={loading}
          className="w-full py-2.5 lg:py-3 rounded-xl font-semibold text-sm text-white
                     bg-linear-to-r from-indigo-500 to-cyan-500
                     hover:from-indigo-600 hover:to-cyan-600
                     shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                     hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Initializing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>⚡</span> New Mission
            </span>
          )}
        </button>

        <button
          id="auto-move-btn"
          onClick={autoMove}
          disabled={!canAutoMove}
          className="w-full py-2.5 lg:py-3 rounded-xl font-semibold text-sm
                     border-2 border-indigo-500/50 text-indigo-400
                     hover:bg-indigo-500/10 hover:border-indigo-400
                     transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed
                     cursor-pointer"
        >
          <span className="flex items-center justify-center gap-2">
            <span>🧠</span> AI Auto Move
          </span>
        </button>
      </div>

      {/* Status pill */}
      {gameState && (
        <div className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-mono
                         ${isGameOver
                           ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                           : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                         }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isGameOver ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`} />
          {isGameOver ? 'TERMINATED' : 'AGENT ACTIVE'}
        </div>
      )}
    </div>
  )
}
