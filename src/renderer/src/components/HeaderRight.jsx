import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { DataContext } from '../context/DataContext'
import { drawNumbers } from '../helpers/drawNumbers'
import { Number } from './Number'

function HeaderRight({ onOpenSettings }) {
  const { numbers, setNumbers, restartNumbers } = useContext(DataContext)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMixing, setIsMixing] = useState(false)
  const [mixingNumber, setMixingNumber] = useState(null)
  const [speed, setSpeed] = useState(8000)
  const [showHistory, setShowHistory] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const intervalRef = useRef(null)
  const mixingIntervalRef = useRef(null)
  const numbersRef = useRef(numbers)
  const bigNumberRef = useRef(null)
  const lastDrawnRef = useRef(null)
  const btnPlayRef = useRef(null)
  const bigTitleRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    numbersRef.current = numbers
  }, [numbers])

  useEffect(() => {
    audioRef.current = {
      play: () => {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.value = 800
          oscillator.type = 'sine'

          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
        } catch (e) {
          console.log('Audio not supported')
        }
      }
    }
  }, [])

  const playSound = useCallback(() => {
    if (audioRef.current?.play) {
      audioRef.current.play()
    }
  }, [])

  const triggerAnimation = useCallback(() => {
    if (lastDrawnRef.current?.firstElementChild) {
      const el = lastDrawnRef.current.firstElementChild
      el.style.animation = 'none'
      el.offsetWidth
      el.style.animation = ''
    }
    if (bigNumberRef.current?.firstElementChild) {
      const el = bigNumberRef.current.firstElementChild
      el.style.animation = 'none'
      el.offsetWidth
      el.style.animation = ''
    }
  }, [])

  const drawSingleNumber = useCallback(() => {
    const newNumbers = drawNumbers(numbersRef.current)
    if (newNumbers) {
      setNumbers(newNumbers)
      playSound()
      setTimeout(triggerAnimation, 50)

      const remaining = newNumbers.filter((n) => !n.disabled).length
      if (remaining === 0) {
        setTimeout(() => setShowGameOver(true), 500)
      }
    }
    return newNumbers
  }, [setNumbers, triggerAnimation, playSound])

  const startMixing = useCallback((callback) => {
    setIsMixing(true)
    const enabledNumbers = numbersRef.current.filter((n) => !n.disabled)
    let mixCount = 0
    const maxMixes = 10

    mixingIntervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * enabledNumbers.length)
      setMixingNumber(enabledNumbers[randomIndex].text)
      mixCount++

      if (mixCount >= maxMixes) {
        clearInterval(mixingIntervalRef.current)
        setMixingNumber(null)
        setIsMixing(false)
        callback()
      }
    }, 100)
  }, [])

  const handleDraw = useCallback(
    (e) => {
      e.preventDefault()
      if (isMixing || isPlaying) return

      startMixing(() => {
        drawSingleNumber()
      })
    },
    [isMixing, isPlaying, startMixing, drawSingleNumber]
  )

  const handlePlay = useCallback(
    (e) => {
      e.preventDefault()
      if (isMixing) return
      setIsPlaying((prev) => !prev)
    },
    [isMixing]
  )

  const handleRestart = useCallback(
    async (e) => {
      e.preventDefault()
      try {
        const resp = await window.api.showConfirmDialog(
          'Reiniciar',
          '¿Quiere reiniciar el tablero?'
        )
        if (resp) {
          setIsPlaying(false)
          if (mixingIntervalRef.current) {
            clearInterval(mixingIntervalRef.current)
          }
          setIsMixing(false)
          setMixingNumber(null)
          setShowGameOver(false)
          await restartNumbers()
        }
      } catch (error) {
        console.error('Error en handleRestart:', error)
        setIsPlaying(false)
        if (mixingIntervalRef.current) {
          clearInterval(mixingIntervalRef.current)
        }
        setIsMixing(false)
        setMixingNumber(null)
        setShowGameOver(false)
        await restartNumbers()
      }
    },
    [restartNumbers]
  )

  const handleSpeedChange = useCallback((e) => {
    const newSpeed = parseInt(e.target.value)
    setSpeed(newSpeed)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      if (btnPlayRef.current) btnPlayRef.current.textContent = '⏸'
      if (bigTitleRef.current) bigTitleRef.current.classList.add('animate-playing')

      intervalRef.current = setInterval(() => {
        startMixing(() => {
          const result = drawSingleNumber()
          if (!result) {
            setIsPlaying(false)
          }
        })
      }, speed)
    } else {
      if (btnPlayRef.current) btnPlayRef.current.textContent = '▶'
      if (bigTitleRef.current) bigTitleRef.current.classList.remove('animate-playing')
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, speed, setNumbers, triggerAnimation, startMixing, drawSingleNumber])

  const drawnNumbers = numbers
    .filter((n) => n.disabled)
    .sort((n1, n2) => n1.pickOrder - n2.pickOrder)
    .reverse()

  const lastDrawn = drawnNumbers.slice(0, 1)
  const previousDrawn = drawnNumbers.slice(1, 6)
  const remainingCount = numbers.filter((n) => !n.disabled).length
  const drawnCount = 90 - remainingCount

  return (
    <>
      <header className="header-right">
        <div ref={bigNumberRef} className="big-number">
          {isMixing && mixingNumber ? (
            <Number disabled={false} text={mixingNumber} isMixing={true} />
          ) : lastDrawn.length > 0 ? (
            <Number key={lastDrawn[0].text} disabled={false} text={lastDrawn[0].text} />
          ) : null}
        </div>
        <ul className="last-drawns">
          {previousDrawn.map((number, index) => (
            <li key={number.text} ref={index === 0 ? lastDrawnRef : undefined}>
              <Number disabled={false} text={number.text} />
            </li>
          ))}
        </ul>
        <div className="remaining-count">
          <span>{remainingCount}</span> números restantes
        </div>
        <div className="speed-control">
          <label htmlFor="speed-slider">Velocidad:</label>
          <input
            id="speed-slider"
            type="range"
            min="2000"
            max="15000"
            step="1000"
            value={speed}
            onChange={handleSpeedChange}
            disabled={isPlaying}
          />
          <span className="speed-value">{(speed / 1000).toFixed(0)}s</span>
        </div>
        <div className="btn-draw-container">
          <button
            className="btn-draw"
            onClick={handleDraw}
            disabled={isMixing || isPlaying || remainingCount === 0}
          >
            🎱 Sacar
          </button>
        </div>
        <ul className="buttons">
          <li>
            <button
              ref={btnPlayRef}
              onClick={handlePlay}
              disabled={isMixing || remainingCount === 0}
            >
              ▶
            </button>
          </li>
          <li>
            <button onClick={() => setShowHistory(true)} className="btn-history">
              📋
            </button>
          </li>
          <li>
            <button onClick={handleRestart}>🔁</button>
          </li>
          <li>
            <button onClick={onOpenSettings} className="btn-settings">
              ⚙
            </button>
          </li>
        </ul>
      </header>

      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Historial de números ({drawnCount}/90)</h2>
              <button className="btn-close" onClick={() => setShowHistory(false)}>
                ✕
              </button>
            </div>
            <div className="history-grid">
              {drawnNumbers.map((number) => (
                <div key={number.text} className="history-item">
                  <Number disabled={true} text={number.text} />
                  <span className="history-order">#{number.pickOrder}</span>
                </div>
              ))}
              {drawnNumbers.length === 0 && (
                <p className="no-history">Aún no se han sacado números</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showGameOver && (
        <div className="modal-overlay game-over-overlay">
          <div className="modal-content game-over-modal">
            <h2>¡Juego Terminado!</h2>
            <p>Se han sacado los 90 números</p>
            <button
              className="btn-restart-game"
              onClick={async () => {
                setShowGameOver(false)
                await restartNumbers()
              }}
            >
              🎮 Nuevo Juego
            </button>
          </div>
        </div>
      )}
    </>
  )
}

HeaderRight.propTypes = {
  onOpenSettings: PropTypes.func.isRequired
}

export default HeaderRight
