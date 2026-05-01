const LEGEND_ITEMS = [
  { label: 'Agent 🤖',   dotClass: 'bg-gradient-to-br from-indigo-500 to-violet-500' },
  { label: 'Safe ✅',    dotClass: 'bg-emerald-500' },
  { label: 'Danger ❌',  dotClass: 'bg-red-500' },
  { label: 'Visited 👣', dotClass: 'bg-slate-600' },
  { label: 'Wumpus 👹', dotClass: 'bg-amber-500' },
  { label: 'Pit 🕳️',   dotClass: 'bg-stone-600' },
  { label: 'Unknown ❓', dotClass: 'bg-slate-700 border border-slate-600' },
  { label: 'Gold 🏆',    dotClass: 'bg-yellow-400' },
]

export default function Legend() {
  return (
    <div className="rounded-2xl p-3 lg:p-4 bg-slate-900 dark:bg-slate-900 border border-slate-800 dark:border-slate-800">

      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full bg-linear-to-b from-indigo-400 to-cyan-400" />
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
          Map Legend
        </span>
      </div>

      {/* Items — 2 cols always */}
      <div className="grid grid-cols-2 gap-x-2 lg:gap-x-3 gap-y-1.5 lg:gap-y-2">
        {LEGEND_ITEMS.map(({ label, dotClass }) => (
          <div key={label} className="flex items-center gap-1.5 lg:gap-2">
            <div className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-sm shrink-0 ${dotClass}`} />
            <span className="text-[11px] lg:text-xs text-slate-400 truncate">{label}</span>
          </div>
        ))}
      </div>

      {/* Percept key */}
      <div className="mt-3 pt-2 lg:pt-3 border-t border-slate-800">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono mb-1.5">
          Percepts
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[11px] lg:text-xs text-slate-500">
            <span>💨</span><span>Breeze — pit adjacent</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] lg:text-xs text-slate-500">
            <span>🦨</span><span>Stench — wumpus adjacent</span>
          </div>
        </div>
      </div>
    </div>
  )
}