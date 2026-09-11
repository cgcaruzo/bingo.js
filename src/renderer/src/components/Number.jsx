import { useContext } from 'react'
import PropTypes from 'prop-types'
import { ConfigContext } from '../context/ConfigContext'
import { getDecadeColor } from '../config/defaultConfig'

export const Number = ({ disabled, text, isMixing }) => {
  const { config } = useContext(ConfigContext)
  const decadeColor = getDecadeColor(config, text)

  const baseStyle = {
    width: undefined,
    height: undefined,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  }

  if (disabled) {
    return (
      <div
        className={`number disabled ${isMixing ? 'mixing' : ''}`}
        style={{
          ...baseStyle,
          background: decadeColor,
          color: 'white',
          border: 'none',
          boxShadow: `inset 0 0 0 3px rgba(255,255,255,0.3), 0 4px 12px ${decadeColor}66`
        }}
      >
        {text}
      </div>
    )
  }

  return (
    <div
      className={`number ${isMixing ? 'mixing' : ''}`}
      style={{
        ...baseStyle,
        background: 'white',
        color: decadeColor,
        border: `3px solid ${decadeColor}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      {text}
    </div>
  )
}

Number.propTypes = {
  disabled: PropTypes.bool.isRequired,
  text: PropTypes.number.isRequired,
  isMixing: PropTypes.bool
}
