import Header from './components/Header'
import Aside from './components/Aside'
import Main from './components/Main'
import Footer from './components/Footer'
import { DataProvider } from './context/DataContext'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <DataProvider>
        <div className="container">
          <Header></Header>
          <Aside></Aside>
          <Main></Main>
        </div>
      </DataProvider>
    </>
  )
}

export default App