const _ = require('lodash')
const Environment = require('../../utils/environment.js')
const HttpErrors = require('../../utils/http-errors.js')
const jwt = require('jsonwebtoken')

const JWT_SECRET_KEY = Environment.getRequired('JWT_SECRET_KEY')

const decodeBearerToken = (req, res, next) => {
  const authorization = req.headers.authorization
  if (authorization && _.startsWith(authorization.toLowerCase(), 'bearer ')) {
    try {
      const token = authorization.split(' ')[1]
      if (!token) {
        return next(HttpErrors.badRequest400('missing token'))
      }

      const decoded = jwt.verify(token, JWT_SECRET_KEY)
      req.authentication = decoded

    } catch (exception) {
      if (exception.name === 'TokenExpiredError') {
        console.error('TokenExpiredError')
      } else {
        console.error(exception)
      }
    }
  }
}

module.exports = decodeBearerToken
