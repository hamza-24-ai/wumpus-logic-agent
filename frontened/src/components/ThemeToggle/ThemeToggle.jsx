import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-16 h-8 rounded-full 
        transition-all duration-300 focus:outline-none cursor-pointer
        ${isDark
          ? 'bg-linear-to-r from-indigo-500 to-cyan-500'
          : 'bg-slate-200'
        }`}
    >
      <span className={`absolute top-1 w-6 h-6 rounded-full 
        bg-white flex items-center justify-center 
        text-sm shadow-md transition-all duration-300
        ${isDark ? 'left-9' : 'left-1'}`}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}