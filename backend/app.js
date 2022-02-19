const express = require('express')
require('express-async-errors')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

mongoose.connect(config.MONGODB_URL)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  // Handle invalid MongoDB id:s
  if (error.name === 'CastError') {
    return res.status(400).json({error: 'malformatted id'})
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }
  else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({error: 'invalid token'})
  }
  else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({error: 'expired token'})
  }

  next(error)
}

app.use(errorHandler)

module.exports = app
