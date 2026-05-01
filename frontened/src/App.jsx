import Controls from './components/Controls/Controls'
import Grid from './components/Grid/Grid'
import Dashboard from './components/Dashboard/Dashboard'
import PerceptLog from './components/Dashboard/Perceptlog'
import Legend from './components/Legend/Legend'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import { useGame } from './context/GameContext'

export default function App() {
  const { error } = useGame()

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 text-slate-100 relative overflow-x-hidden">

      {/* Animated background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="animate-blob absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="animate-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-500/8 blur-3xl" />
      </div>

      {/* ── Sticky Navbar ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 dark:border-slate-800">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm shadow-lg shadow-indigo-500/30 shrink-0">
              🤖
            </div>
            <div>
              <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent font-bold text-base lg:text-lg tracking-tight">
                Wumpus Logic Agent
              </span>
              <div className="hidden lg:block text-[10px] text-slate-500 tracking-widest uppercase -mt-0.5">
                AI Knowledge Base Navigator
              </div>
            </div>
          </div>

          {/* Nav right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400 font-mono">ONLINE</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Global Error Banner ────────────────────────── */}
      {error && (
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 pt-3">
          <div className="animate-slide-in flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* ── Main Layout ────────────────────────────────── */}
      <main className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 lg:p-6">

        {/* Left panel — horizontal row on mobile, vertical column on desktop */}
        <aside className="flex flex-row lg:flex-col gap-3 lg:gap-4 w-full lg:w-72 lg:shrink-0">
          <div className="flex-1 lg:flex-none">
            <Controls />
          </div>
          <div className="flex-1 lg:flex-none">
            <Legend />
          </div>
        </aside>

        {/* Center — Grid */}
        <section className="w-full lg:flex-1 lg:min-w-0">
          <Grid />
        </section>

        {/* Right panel */}
        <aside className="w-full lg:w-80 lg:shrink-0 flex flex-col gap-4">
          <Dashboard />
          <PerceptLog />
        </aside>

      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-[11px] text-slate-700 font-mono tracking-wider">
        WUMPUS LOGIC AGENT @2026 — MUHAMMAD HAMZA
      </footer>
    </div>
  )
}