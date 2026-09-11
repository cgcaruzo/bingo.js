import { useState, useCallback, useEffect } from 'react'
import { createContext } from 'react'
import PropTypes from 'prop-types'

export const DataContext = createContext()

const createDefaultNumbers = () => {
  return [...Array(90).keys()]
    .map((i) => i + 1)
    .map((n) => {
      return { disabled: false, text: n, pickOrder: null }
    })
}

export const DataProvider = ({ children }) => {
  const [numbers, setNumbers] = useState(createDefaultNumbers)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [savedGameState, setSavedGameState] = useState(null)

  useEffect(() => {
    const checkSavedGame = async () => {
      try {
        const result = await window.api.loadGameState()
        if (result.success && result.exists && result.gameState) {
          setSavedGameState(result.gameState)
          setShowResumeDialog(true)
        }
      } catch (error) {
        console.error('Error al verificar juego guardado:', error)
      }
      setIsLoaded(true)
    }
    checkSavedGame()
  }, [])

  const resumeGame = useCallback(() => {
    if (savedGameState) {
      setNumbers(savedGameState)
    }
    setShowResumeDialog(false)
    setSavedGameState(null)
  }, [savedGameState])

  const startNewGame = useCallback(async () => {
    setShowResumeDialog(false)
    setSavedGameState(null)
    setNumbers(createDefaultNumbers())
    try {
      await window.api.deleteGameState()
    } catch (error) {
      console.error('Error al eliminar juego guardado:', error)
    }
  }, [])

  const updateNumbers = useCallback(async (newNumbers) => {
    setNumbers(newNumbers)
    try {
      await window.api.saveGameState(newNumbers)
    } catch (error) {
      console.error('Error al guardar estado:', error)
    }
  }, [])

  const restartNumbers = useCallback(async () => {
    setNumbers(createDefaultNumbers())
    try {
      await window.api.deleteGameState()
    } catch (error) {
      console.error('Error al eliminar estado:', error)
    }
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <DataContext.Provider
      value={{
        numbers,
        setNumbers: updateNumbers,
        restartNumbers,
        showResumeDialog,
        resumeGame,
        startNewGame
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

DataProvider.propTypes = {
  children: PropTypes.node.isRequired
}
