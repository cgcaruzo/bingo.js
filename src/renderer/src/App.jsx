import HeaderLeft from './components/HeaderLeft'
import HeaderRight from './components/HeaderRight'
import Main from './components/Main'
import Footer from './components/Footer'
import { DataProvider } from './context/DataContext'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <DataProvider>
        <div className="container">
          <HeaderLeft></HeaderLeft>
          <HeaderRight></HeaderRight>
          <Main></Main>
        </div>
      </DataProvider>
    </>
  )
}

export default App