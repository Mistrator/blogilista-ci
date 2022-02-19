import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import NewBlog from './NewBlog'

let component

const createHandler = jest.fn()

beforeEach(() => {
  component = render(
    <NewBlog
      create={createHandler}
    />
  )
})

test('creation callback is called with correct parameters when blog is created', () => {
  const testBlog = {
    title: 'Blog Title',
    author: 'Blog Author',
    url: 'https://localhost'
  }

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  // Fill the form fields
  fireEvent.change(title, {
    target: { value : testBlog.title }
  })
  fireEvent.change(author, {
    target: { value : testBlog.author }
  })
  fireEvent.change(url, {
    target: { value : testBlog.url }
  })

  // Submit the form
  const createButton = component.getByText('Create')
  fireEvent.click(createButton)

  expect(createHandler.mock.calls).toHaveLength(1)
  expect(createHandler.mock.calls[0][0]).toStrictEqual(testBlog)
})
