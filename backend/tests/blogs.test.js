const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let apiTokens = {}

const resetDatabase = async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  await User.insertMany(helper.initialUsers)
  await Blog.insertMany(helper.initialBlogs)
}

beforeAll(async () => {
  await resetDatabase()

  apiTokens = {}

  // Get a valid auth token for each user.
  for (const user of helper.initialUsers) {
    const password = helper.userPasswords[user.username]

    const credentials = {
      'username': user.username,
      'password': password
    }

    const res = await api
      .post('/api/login')
      .send(credentials)

    apiTokens[user.username] = 'Bearer ' + res.body.token
  }
})

// Clear database and create initial blogs for each test
beforeEach(async () => {
  await resetDatabase()
})

describe('GET /api/blogs', () => {
  test('returns JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog identifier is called id', async() => {
    const response = await api.get('/api/blogs')

    expect(response.statusCode).toEqual(200)

    for (const blog of response.body) {
      expect(blog['id']).toBeDefined()
    }
  })
})

describe('POST /api/blogs', () => {
  test('creates a new blog', async () => {
    const newBlog = {
      'title': 'a',
      'author': 'b',
      'url': 'c',
      'likes': 4
    }

    const blogsBefore = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .set('Authorization', apiTokens['testuser'])
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter.length).toEqual(blogsBefore.length + 1)
  })

  test('fails if no auth token is provided', async () => {
    const newBlog = {
      'title': 'a',
      'author': 'b',
      'url': 'c',
      'likes': 4
    }

    const blogsBefore = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter.length).toEqual(blogsBefore.length)
  })

  test('defaults likes to 0 if not set', async () => {
    const newBlog = {
      'title': 'a',
      'author': 'b',
      'url': 'c',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', apiTokens['testuser'])
      .send(newBlog)
    expect(response.statusCode).toEqual(201)
    expect(response.body['likes']).toEqual(0)
  })

  test('returns 400 Bad Request if title is not set', async () => {
    const blogNoTitle = {
      'author': 'a',
      'url': 'b',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', apiTokens['testuser'])
      .send(blogNoTitle)
    expect(response.statusCode).toEqual(400)
  })

  test('returns 400 Bad Request if url is not set', async () => {
    const blogNoUrl = {
      'title': 'a',
      'author': 'b',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', apiTokens['testuser'])
      .send(blogNoUrl)
    expect(response.statusCode).toEqual(400)
  })

  test('assigns an owner to the blog', async () => {
    const newBlog = {
      'title': 'a',
      'author': 'b',
      'url': 'c',
      'likes': 4
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', apiTokens['testuser'])
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(result.body['user']).toBeDefined()
  })
})

describe('DELETE /api/blogs/<id>', () => {
  test('deletes the blog with given id', async () => {
    const initialBlogs = await helper.blogsInDb()
    const idToDelete = initialBlogs[0].id

    const response = await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', apiTokens['testuser'])
    expect(response.statusCode).toEqual(204)

    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs.length).toBe(initialBlogs.length - 1)

    // check that the correct blog was deleted
    for (const blog of currentBlogs) {
      expect(blog.id).not.toEqual(idToDelete)
    }
  })

  test('works correctly for a non-existing id', async () => {
    const idToDelete = await helper.nonExistingId()

    const initialBlogs = await helper.blogsInDb()

    const response = await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', apiTokens['testuser'])
    expect(response.statusCode).toEqual(204)

    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs).toEqual(initialBlogs)
  })
})

describe('PUT /api/blogs/<id>', () => {
  test('updates a blog correctly', async () => {
    const initialBlogs = await helper.blogsInDb()
    const idToUpdate = initialBlogs[0].id

    const newBlog = {
      'title': 'a',
      'author': 'b',
      'url': 'c',
      'likes': 6,
      'user': initialBlogs[0].user
    }

    expect(initialBlogs).not.toContainEqual(newBlog)

    const response = await api
      .put(`/api/blogs/${idToUpdate}`)
      .set('Authorization', apiTokens['testuser'])
      .send(newBlog)
    expect(response.statusCode).toEqual(200)

    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs.length).toEqual(initialBlogs.length)

    newBlog['id'] = idToUpdate
    expect(currentBlogs).toContainEqual(newBlog)
  })

  test('returns 404 if the blog does not exist', async () => {
    const idToUpdate = await helper.nonExistingId()

    const newBlog = {
      'title': 'a',
      'author': 'b',
      'url': 'c',
      'likes': 6
    }

    const initialBlogs = await helper.blogsInDb()

    const response = await api
      .put(`/api/blogs/${idToUpdate}`)
      .set('Authorization', apiTokens['testuser'])
      .send(newBlog)
    expect(response.statusCode).toEqual(404)

    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs).toEqual(initialBlogs)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
