import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  // Key for currently logged in user in local storage
  const savedLogin = 'loggedInUser'

  useEffect(() => {
    const userJSON = window.localStorage.getItem(savedLogin)
    if (userJSON) {
      const loggedInUser = JSON.parse(userJSON)
      setCurrentUser(loggedInUser)
    }
  }, [])

  const setCurrentUser = (user) => {
    setUser(user)
    const token = user ? user.token : null
    blogService.setToken(token)
  }

  const login = (user) => {
    setCurrentUser(user)
    window.localStorage.setItem(savedLogin, JSON.stringify(user))
    showInfoMessage(`${user.name} logged in`)
  }

  const logout = () => {
    setCurrentUser(null)
    window.localStorage.removeItem(savedLogin)
    showInfoMessage('Logged out')
  }

  const showInfoMessage = (message) => {
    setInfoMessage(message)

    const duration = 2500
    setTimeout(() => {
      setInfoMessage(null)
    }, duration)
  }

  const showErrorMessage = (message) => {
    setErrorMessage(message)

    const duration = 2500
    setTimeout(() => {
      setErrorMessage(null)
    }, duration)
  }

  const createBlog = async (newBlog) => {
    const res = await blogService.create(newBlog)

    const newBlogs = blogs.concat(res)
    setBlogs(newBlogs)

    showInfoMessage(`Added new blog ${res.title}`)
    blogFormRef.current.toggleVisibility()
  }

  const likeBlog = async (blog) => {
    const newBlog = { ...blog, likes: blog.likes + 1 }

    try {
      const res = await blogService.update(newBlog)
      setBlogs(blogs.map(x => x.id === res.id ? res : x))
    } catch (ex) {
      showErrorMessage('Unauthorized')
    }
  }

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title}?`)) {
      return
    }

    try {
      await blogService.remove(blog)
      setBlogs(blogs.filter(x => x.id !== blog.id))
      showInfoMessage('Blog removed')
    } catch (ex) {
      showErrorMessage('Unauthorized')
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      <div>
        <Notification message={errorMessage} textColor='red' />
        <Notification message={infoMessage} textColor='green' />
      </div>

      {user === null
        ?
        <div>
          <h2>Log in</h2>
          <Login login={login} showErrorMessage={showErrorMessage} />
        </div>
        :
        <div>
          <div>
            {user.name} logged in
            <button onClick={logout}>Logout</button>
          </div>
          <div className='new-blog-form'>
            <h2>Create new</h2>
            <Togglable buttonLabel='Show' ref={blogFormRef}>
              <NewBlog create={createBlog} />
            </Togglable>
          </div>
          <div className='bloglist'>
            <h2>Blogs</h2>
            {
              Array.from(blogs).sort((a, b) => (b.likes - a.likes)).map(blog =>
                <Blog key={blog.id} blog={blog} loggedInUser={user} addLike={likeBlog} remove={removeBlog}/>)
            }
          </div>
        </div>
      }
    </div>
  )
}

export default App