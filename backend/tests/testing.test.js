const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const resetDatabase = async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await User.insertMany(helper.initialUsers)
  await Blog.insertMany(helper.initialBlogs)
}

beforeEach(async () => {
  await resetDatabase()
})

describe('POST /api/testing/reset', () => {
  test('clears the database', async () => {
    const blogsBefore = await helper.blogsInDb()
    expect(blogsBefore.length).not.toEqual(0)

    await api
      .post('/api/testing/reset')
      .send()
      .expect(204)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.length).toEqual(0)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
