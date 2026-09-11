import { eventConfig } from '../config/eventConfig'

function HeaderLeft() {
  return (
    <>
      <header className="header-left">
        <div className="title-container">
          <h1 id="big-title" className="big-title">
            {eventConfig.eventName}
          </h1>
          {eventConfig.subtitle && <p className="subtitle">{eventConfig.subtitle}</p>}
        </div>
      </header>
    </>
  )
}

export default HeaderLeft
