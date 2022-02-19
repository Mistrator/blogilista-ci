const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (req, res, next) => {
  const authHeader = req.get('authorization')
  const authType = 'bearer '

  req['token'] = null
  if (authHeader && authHeader.toLowerCase().startsWith(authType)) {
    req['token'] = authHeader.substring(authType.length)
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token,
    process.env.LOGIN_TOKEN_HMAC_KEY)

  if (!(req.token && decodedToken)) {
    return res.status(401).json({error: 'missing or invalid token'})
  }

  req['user'] = await User.findById(decodedToken.id)
  next()
}

module.exports = { tokenExtractor, userExtractor }
