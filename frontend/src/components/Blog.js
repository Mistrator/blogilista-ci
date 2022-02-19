import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, loggedInUser, addLike, remove }) => {
  const [expanded, setExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setExpanded(!expanded)
  }

  return (
    <div className='blog' style={blogStyle}>
      <div>
        <i>{blog.title}</i> by {blog.author}
        <button onClick={toggleVisibility}>{expanded ? 'Hide' : 'Show'}</button>
      </div>
      {expanded &&
      <div>
        <div>
          {blog.url}
        </div>
        <div className='likes'>
          {blog.likes}
          {loggedInUser.username === blog.user.username &&
            <button onClick={() => { addLike(blog) }}>Like</button>}
        </div>
        {loggedInUser.username === blog.user.username &&
          <button onClick={ () => { remove(blog) }}>Remove</button>}
      </div>
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired
}

export default Blog
