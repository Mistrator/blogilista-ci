const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const allUsers = await User
    .find({})
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
      id: 1
    })

  res.json(allUsers)
})

usersRouter.post('/', async (req, res) => {
  const body = req.body

  // Check for existence here, because we need both username and
  // password in this function, and mongoose model rules are checked
  // only after we need them.
  if (!body.username) {
    return res.status(400).json({'error': 'username missing'})
  }

  if (!body.password) {
    return res.status(400).json({'error': 'password missing'})
  }

  // mongoose-unique-validator 3.0.0 has an unresolved bug
  // (GitHub issue #131) which prevents us from using it for
  // username uniqueness checking. Use a workaround instead.
  // https://github.com/blakehaswell/mongoose-unique-validator/issues/131
  const existingUser = await User.find({username: body.username})
  if (existingUser.length > 0) {
    return res.status(400).json({'error': 'duplicate username'})
  }

  if (body.password.length < 3) {
    return res.status(400).json({'error': 'password too short'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    passwordHash: passwordHash,
    name: body.name
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = usersRouter
