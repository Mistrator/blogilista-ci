const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

// Clear database and create initial users for each test
beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('GET /api/users', () => {
  test('returns JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns correct amount of users', async () => {
    const response = await api.get('/api/users')
    expect(response.statusCode).toEqual(200)
    expect(response.body.length).toEqual(helper.initialUsers.length)
  })
})

describe('POST /api/users', () => {
  test('creates a new user', async () => {
    const newUser = {
      'username': 'aaaaaaaa',
      'password': 'bbbbbbbb',
      'name': 'cccccccc'
    }

    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    expect(usersAfter.length).toEqual(usersBefore.length + 1)
  })

  test('requires username and password be provided', async () => {
    const usersBefore = await helper.usersInDb()

    const noUsername = {
      'password': 'bbbbbbbb',
      'name': 'cccccccc'
    }

    const noPassword = {
      'username': 'aaaaaaaa',
      'name': 'cccccccc'
    }

    await api
      .post('/api/users')
      .send(noUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/users')
      .send(noPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    expect(usersAfter.length).toEqual(usersBefore.length)
  })

  test('rejects shorter than 3-character usernames and passwords', async () => {
    const usersBefore = await helper.usersInDb()

    const shortUsername = {
      'username': 'aa',
      'password': 'bbbbbbbb',
      'name': 'cccccccc'
    }

    const shortPassword = {
      'username': 'aaaaaaaa',
      'password': 'bb',
      'name': 'cccccccc'
    }

    await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    expect(usersAfter.length).toEqual(usersBefore.length)
  })

  test('rejects duplicate usernames', async () => {
    const usersBefore = await helper.usersInDb()

    const user = {
      username: usersBefore[0].username,
      password: 'bbbbbbbb',
      name: 'cccccccc'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    expect(usersAfter.length).toEqual(usersBefore.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
