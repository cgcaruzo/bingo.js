import { useContext } from 'react'
import HeaderLeft from './components/HeaderLeft'
import HeaderRight from './components/HeaderRight'
import Main from './components/Main'
import { DataProvider, DataContext } from './context/DataContext'

function ResumeGameModal() {
  const { resumeGame, startNewGame } = useContext(DataContext)

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '1vw' }}>
          Juego anterior encontrado
        </h2>
        <p style={{ fontSize: '1.2vw', marginBottom: '2vw', color: 'var(--color-text-muted)' }}>
          Se encontró un juego en progreso. ¿Desea retomarlo?
        </p>
        <div style={{ display: 'flex', gap: '1vw', justifyContent: 'center' }}>
          <button
            onClick={startNewGame}
            style={{
              padding: '0.8vw 2vw',
              fontSize: '1.1vw',
              borderRadius: '8px',
              border: '2px solid var(--color-border)',
              background: 'var(--color-bg-panel-alt)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Nuevo juego
          </button>
          <button
            onClick={resumeGame}
            style={{
              padding: '0.8vw 2vw',
              fontSize: '1.1vw',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--color-primary)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Retomar juego
          </button>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { showResumeDialog } = useContext(DataContext)

  return (
    <>
      <div className="container">
        <HeaderLeft />
        <HeaderRight />
        <Main />
      </div>
      {showResumeDialog && <ResumeGameModal />}
    </>
  )
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  )
}

export default App
