import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, textColor }) => {
  if (message === null) {
    return null
  }

  const infoStyle = {
    color: textColor,
    borderStyle: 'solid',
    padding: '10px',
    marginBottom: '10px'
  }

  return <div style={infoStyle}>{message}</div>
}

Notification.propTypes = {
  message: PropTypes.string,
  textColor: PropTypes.string.isRequired
}

export default Notification
