import { createContext, useContext, useState } from 'react'
export const GameContext = createContext()

const API = 'http://localhost:8000'

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rows, setRows] = useState(4)
  const [cols, setCols] = useState(4)
  const [message, setMessage] = useState('Start the new game! 🎮')

  const [inferenceSteps, setInferenceSteps] = useState(0)

  const handleResponse = (data) => {
    if (data.error) { setError(data.error); return }
    setGameState(data)
    setMessage(data.move_reason || data.message || '')
    setInferenceSteps(data.kb_stats?.total_inference_steps || 0)
    setError(null)
  }

  const startNewGame = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/new-game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows, cols })
      })
      handleResponse(await res.json())
    } catch { setError('Backend is not connecting!') }
    setLoading(false)
  }

  const moveAgent = async (row, col) => {
    if (!gameState || loading || gameState.alive === false) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row, col })
      })
      handleResponse(await res.json())
    } catch { setError('Move failed!') }
    setLoading(false)
  }

  const autoMove = async () => {
    if (!gameState || loading || gameState.alive === false) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auto-move`)
      handleResponse(await res.json())
    } catch { setError('Auto move failed!') }
    setLoading(false)
  }

  return (
    <GameContext.Provider value={{
      gameState, loading, error,
      rows, setRows, cols, setCols,
      message, inferenceSteps,
      startNewGame, moveAgent, autoMove
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)