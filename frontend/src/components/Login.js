import React, { useState } from 'react'
import PropTypes from 'prop-types'
import loginService from '../services/login'

const Login = ({ login, showErrorMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    const credentials = {
      username,
      password
    }
    setUsername('')
    setPassword('')

    try {
      const user = await loginService.login(credentials)
      login(user)
    } catch(ex) {
      console.log('failed to log in: ', ex)
      showErrorMessage('Failed to log in (invalid credentials?)')
    }
  }

  return <form onSubmit={handleLogin}>
    <div>
      Username:
      <input
        id='username'
        type='text'
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      Password:
      <input
        id='password'
        type='text'
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type='submit' id='loginbutton'>Login</button>
  </form>
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  showErrorMessage: PropTypes.func.isRequired
}

export default Login
