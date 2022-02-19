import React, { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlog = ({ create }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submit = async (event) => {
    event.preventDefault()

    const blog = {
      title,
      author,
      url
    }

    create(blog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return <form onSubmit={submit}>
    <div>
      Title:
      <input
        id='title'
        type='text'
        value={title}
        onChange={({ target }) => setTitle(target.value)}
      />
    </div>
    <div>
      Author:
      <input
        id='author'
        type='text'
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
      />
    </div>
    <div>
      URL:
      <input
        id='url'
        type='text'
        value={url}
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
    <button id='create-blog' type='submit'>Create</button>
  </form>
}

NewBlog.propTypes = {
  create: PropTypes.func.isRequired
}

export default NewBlog
