import { useGame } from '../../context/GameContext'

const STAT_CONFIG = [
  { key: 'total_clauses',         label: 'KB Clauses',   icon: '📋', color: 'text-indigo-400' },
  { key: 'total_inference_steps', label: 'Inferences',   icon: '⚡', color: 'text-cyan-400'   },
  { key: 'visited_cells',         label: 'Visited',      icon: '👣', color: 'text-emerald-400' },
  { key: 'safe_cells',            label: 'Safe Cells',   icon: '✅', color: 'text-emerald-400' },
  { key: 'unsafe_cells',          label: 'Unsafe',       icon: '☠️', color: 'text-red-400'    },
]

export default function Dashboard() {
  const { gameState, message, inferenceSteps } = useGame()
  const stats = gameState?.kb_stats || {}

  return (
    <div className="flex flex-col gap-3 lg:gap-4">

      {/* Message Box */}
      <div className="animate-slide-in rounded-2xl p-3 lg:p-4
                      bg-slate-900 dark:bg-slate-900
                      border-l-4 border-indigo-500
                      border  dark:border-slate-800">
        <div className="flex items-start gap-2 lg:gap-3">
          <span className="text-base lg:text-lg mt-0.5 shrink-0">💬</span>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">
              Agent Log
            </p>
            <p className="text-xs lg:text-sm font-medium text-slate-200 dark:text-slate-200 leading-relaxed">
              {message || 'Awaiting mission start...'}
            </p>
          </div>
        </div>
      </div>

      {/* KB Stats Card */}
      <div className="rounded-2xl p-3 lg:p-4 bg-slate-900 dark:bg-slate-900 border border-slate-800 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-linear-to-b from-indigo-400 to-cyan-400" />
          <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
            Knowledge Base Stats
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {STAT_CONFIG.map(({ key, label, icon, color }) => {
            const val = key === 'total_inference_steps'
              ? inferenceSteps
              : (stats[key] ?? '—')
            return (
              <div
                key={key}
                className="flex flex-col gap-1 p-2 lg:p-3 rounded-xl
                           bg-slate-800/50 dark:bg-slate-800/50
                           border border-slate-700/50 dark:border-slate-700/50
                           hover:border-slate-600/80 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{icon}</span>
                  <span className="text-[11px] text-slate-500 font-medium truncate">{label}</span>
                </div>
                <span className={`text-xl lg:text-2xl font-bold font-mono ${color}`}>
                  {val}
                </span>
              </div>
            )
          })}

          {/* Agent position */}
          {gameState?.agent_pos && (
            <div className="flex flex-col gap-1 p-2 lg:p-3 rounded-xl
                            bg-indigo-500/10 border border-indigo-500/20
                            hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">🤖</span>
                <span className="text-[11px] text-slate-500 font-medium">Position</span>
              </div>
              <span className="text-xl lg:text-2xl font-bold font-mono text-indigo-400">
                ({gameState.agent_pos.row},{gameState.agent_pos.col})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}