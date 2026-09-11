import { useContext } from 'react'
import { ConfigContext } from '../context/ConfigContext'

function HeaderLeft() {
  const { config } = useContext(ConfigContext)

  return (
    <>
      <header className="header-left">
        <div className="title-container">
          <h1 id="big-title" className="big-title">
            {config.eventName}
          </h1>
          {config.subtitle && <p className="subtitle">{config.subtitle}</p>}
        </div>
      </header>
    </>
  )
}

export default HeaderLeft
