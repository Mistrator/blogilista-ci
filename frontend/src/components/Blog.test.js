import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

let component

const testuser = {
  username: 'testuser',
}

const testblog = {
  title: 'Test Blog',
  author: 'Test Author',
  url: 'https://localhost',
  likes: 3,
  user: testuser
}

const likeHandler = jest.fn()
const removeHandler = jest.fn()

beforeEach(() => {
  component = render(
    <Blog
      blog={testblog}
      loggedInUser={testuser}
      addLike={likeHandler}
      remove={removeHandler}
    />
  )
})

test('renders only title and author when initially not expanded', () => {
  expect(component.container).toHaveTextContent(testblog.title)
  expect(component.container).toHaveTextContent(testblog.author)
  expect(component.container).not.toHaveTextContent(testblog.url)
  expect(component.container).not.toHaveTextContent(testblog.likes)
})

test('renders title, author, url and likes when expanded', () => {
  const expandButton = component.getByText('Show')
  fireEvent.click(expandButton)

  expect(component.container).toHaveTextContent(testblog.title)
  expect(component.container).toHaveTextContent(testblog.author)
  expect(component.container).toHaveTextContent(testblog.url)
  expect(component.container).toHaveTextContent(testblog.likes)
})

test('if like button is clicked twice, like event handler is called twice', () => {
  // Like button is not visible if blog is not expanded
  const expandButton = component.getByText('Show')
  fireEvent.click(expandButton)

  const likeButton = component.getByText('Like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(likeHandler.mock.calls).toHaveLength(2)
})
