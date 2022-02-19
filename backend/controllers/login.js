const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const body = req.body
  const user = await User.findOne({username: body.username})

  let passwordOk = false
  if (user) {
    passwordOk = await bcrypt.compare(body.password, user.passwordHash)
  }

  if (!(user && passwordOk)) {
    return res.status(401).json({error: 'invalid username or password'})
  }

  const tokenUser = {
    username: user.username,
    id: user._id
  }

  const validityPeriod = 60 * 60 // seconds

  const token = jwt.sign(tokenUser,
    process.env.LOGIN_TOKEN_HMAC_KEY,
    {expiresIn: validityPeriod})

  res.status(200).send({token, username: user.username, name: user.name})
})

module.exports = loginRouter
