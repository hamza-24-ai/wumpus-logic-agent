import { useGame } from '../../context/GameContext'

const PERCEPTS = [
  { key: 'breeze',  label: 'Breeze',  icon: '💨', desc: 'Pit nearby'    },
  { key: 'stench',  label: 'Stench',  icon: '🦨', desc: 'Wumpus nearby' },
  { key: 'glitter', label: 'Glitter', icon: '✨', desc: 'Gold nearby'   },
]

export default function PerceptLog() {
  const { gameState } = useGame()
  const percepts = gameState?.percepts || {}

  return (
    <div className="rounded-2xl p-3 lg:p-4 bg-slate-900 dark:bg-slate-900 border border-slate-800 dark:border-slate-800">

      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full bg-linear-to-b from-indigo-400 to-cyan-400" />
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
          Sensor Percepts
        </span>
      </div>

      {/* Percept pills — horizontal scroll on mobile, vertical on desktop */}
      <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
        {PERCEPTS.map(({ key, label, icon, desc }) => {
          const active = !!percepts[key]
          return (
            <div
              key={key}
              className={[
                'flex items-center justify-between px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl shrink-0',
                active
                  ? 'bg-linear-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/40 text-indigo-300 font-medium text-sm shadow-sm shadow-indigo-500/10 animate-slide-in'
                  : 'bg-slate-800/50 dark:bg-slate-800/50 border border-slate-700 dark:border-slate-700 text-slate-500 text-sm',
              ].join(' ')}
            >
              <div className="flex items-center gap-2">
                <span className={`text-base transition-all duration-300 ${active ? '' : 'grayscale opacity-40'}`}>
                  {icon}
                </span>
                <div>
                  <div className="font-medium text-xs lg:text-sm">{label}</div>
                  <div className="text-[10px] opacity-60 hidden lg:block">{desc}</div>
                </div>
              </div>

              {/* Status badge */}
              <span className={
                active
                  ? 'px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'px-2 py-0.5 rounded-full text-xs font-mono bg-slate-700 text-slate-500'
              }>
                {active ? 'ON' : 'OFF'}
              </span>
            </div>
          )
        })}
      </div>

      {!gameState && (
        <div className="mt-2 text-center text-xs text-slate-600 font-mono py-2">
          — sensors offline —
        </div>
      )}
    </div>
  )
}
