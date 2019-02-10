const _ = require('lodash')
const Environment = require('../../utils/environment.js')
const HttpErrors = require('../../utils/http-errors.js')
const jwt = require('jsonwebtoken')

const JWT_SECRET_KEY = Environment.getRequired('JWT_SECRET_KEY')

const decodeBearerToken = (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization) {
    return next()
  }
  if (!_.startsWith(authorization.toLowerCase(), 'bearer ')) {
    return next(HttpErrors.badRequest400('unsupported authorization'))
  }
  const token = authorization.split(' ')[1]
  if (!token) {
    return next(HttpErrors.badRequest400('missing token'))
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY)
    req.authentication = decoded
  } catch (exception) {
    if (exception.name === 'TokenExpiredError') {
      return next(HttpErrors.unauthorized401('token expired'))
    } else {
      return next(exception)
    }
  }

  next()
}

module.exports = decodeBearerToken
