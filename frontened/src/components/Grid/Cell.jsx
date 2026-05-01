import { useGame } from '../../context/GameContext'

function getCellStateClasses(cell) {
  if (cell.is_agent) {
    return `bg-gradient-to-br from-indigo-600 to-violet-700
      border-2 border-indigo-400 animate-glow
      shadow-lg shadow-indigo-500/50 scale-105`
  }
  if (cell.has_wumpus) {
    return `bg-gradient-to-br from-orange-900 to-amber-800
      border-2 border-amber-500 shadow-md shadow-amber-500/30`
  }
  if (cell.has_pit) {
    return `bg-gradient-to-br from-stone-900 to-stone-800
      border-2 border-stone-600`
  }
  if (cell.safe && !cell.visited) {
    return `bg-gradient-to-br from-emerald-900 to-green-800
      border-2 border-emerald-500
      shadow-md shadow-emerald-500/20
      hover:shadow-emerald-500/40`
  }
  if (cell.visited) {
    return `bg-gradient-to-br from-slate-800 to-slate-700
      border border-slate-600`
  }
  // Default unknown
  return `bg-slate-900 dark:bg-slate-900
    border border-slate-700 dark:border-slate-700`
}

function getCellIcon(cell) {
  if (cell.is_agent)              return '🤖'
  if (cell.has_wumpus)            return '👹'
  if (cell.has_pit)               return '🕳️'
  if (cell.has_gold)              return '🏆'
  if (cell.safe && !cell.visited) return '✅'
  if (!cell.visited && !cell.safe) return '❓'
  return null
}

export default function Cell({ cell, rowIdx, colIdx }) {
  const { moveAgent, gameState } = useGame()

  // ── Adjacency check ───────────────────────────────────
  const isAlive = gameState?.alive !== false
  const agentRow = gameState?.agent_pos?.row
  const agentCol = gameState?.agent_pos?.col

  const rowDiff = Math.abs(rowIdx - (agentRow ?? -99))
  const colDiff = Math.abs(colIdx - (agentCol ?? -99))
  const isAdjacent =
    (rowDiff === 1 && colDiff === 0) ||
    (rowDiff === 0 && colDiff === 1)

  const canClick = !!gameState && isAlive && isAdjacent

  const handleClick = () => {
    if (!gameState || gameState.alive === false) return

    const isAdj =
      (rowDiff === 1 && colDiff === 0) ||
      (rowDiff === 0 && colDiff === 1)

    if (!isAdj) return
    moveAgent(rowIdx, colIdx)
  }

  // ── Interaction classes ───────────────────────────────
  const interactionClasses = canClick
    ? 'hover:scale-105 hover:brightness-125 cursor-pointer'
    : 'cursor-not-allowed'

  // ── Adjacent glow ring (not on agent cell) ────────────
  const adjacentRing =
    canClick && !cell.is_agent
      ? 'ring-2 ring-indigo-400/50 ring-offset-1 ring-offset-slate-900'
      : ''

  const icon = getCellIcon(cell)

  return (
    <div
      id={`cell-${rowIdx}-${colIdx}`}
      onClick={handleClick}
      role="button"
      aria-label={`Cell ${rowIdx},${colIdx}${isAdjacent ? ' (moveable)' : ''}`}
      tabIndex={canClick ? 0 : -1}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      className={[
        // Base layout
        'relative flex flex-col items-center justify-center',
        'rounded-xl transition-all duration-200 select-none aspect-square',
        // Responsive icon/size
        'min-w-[40px] sm:min-w-[50px] lg:min-w-[60px]',
        // State-based visual
        getCellStateClasses(cell),
        // Interaction
        interactionClasses,
        adjacentRing,
      ].join(' ')}
    >
      {/* Coordinate label */}
      <span className="absolute top-0.5 left-1 font-mono text-[8px] lg:text-[9px] opacity-30 text-white">
        {rowIdx},{colIdx}
      </span>

      {/* Main icon — responsive size */}
      {icon && (
        <span className="text-base sm:text-lg lg:text-2xl leading-none z-10">
          {icon}
        </span>
      )}

      {/* Percepts (visited cells only) */}
      {cell.visited && (
        <div className="absolute bottom-0.5 flex gap-0.5">
          {cell.has_breeze && <span className="text-[8px] lg:text-[10px]">💨</span>}
          {cell.has_stench && <span className="text-[8px] lg:text-[10px]">🦨</span>}
        </div>
      )}

      {/* Gold shimmer overlay */}
      {cell.has_gold && !cell.has_pit && !cell.has_wumpus && (
        <div className="absolute inset-0 rounded-xl bg-linear-to-br from-yellow-400/10 to-amber-500/10 pointer-events-none" />
      )}
    </div>
  )
}