import PropTypes from 'prop-types'

export const Number = ({ disabled, text, isMixing }) => {
  const getDecadeClass = () => {
    if (text <= 9) return 'decade-1'
    if (text <= 19) return 'decade-2'
    if (text <= 29) return 'decade-3'
    if (text <= 39) return 'decade-4'
    if (text <= 49) return 'decade-5'
    if (text <= 59) return 'decade-6'
    if (text <= 69) return 'decade-7'
    if (text <= 79) return 'decade-8'
    return 'decade-9'
  }

  const className = `number ${disabled ? 'disabled' : ''} ${getDecadeClass()} ${isMixing ? 'mixing' : ''}`

  return <div className={className}>{text}</div>
}

Number.propTypes = {
  disabled: PropTypes.bool.isRequired,
  text: PropTypes.number.isRequired,
  isMixing: PropTypes.bool
}
