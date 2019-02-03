/*
  - verifies user email and password
  - returns JSON web token (JWT) used to sign requests via the header "Authentication: Bearer {token}"
*/

const _ = require('lodash')
const bcrypt = require('bcrypt')
const Environment = require('../../utils/environment.js')
const HttpErrors = require('../../utils/http-errors.js')
const jwt = require('jsonwebtoken')
const MongoUtil = require('../../utils/mongo-util.js')

const JWT_SECRET_KEY = Environment.getRequired('JWT_SECRET_KEY')

const TOKEN_EXPIRES_IN_SECONDS = 24 * 60 * 60 // 1 day

module.exports = (router) => {
  router.post('/auth/verify-password', async (req, res, next) => {
    const email = req.body.email
    if (!_.isString(email)) {
      return next(HttpErrors.badRequest400('email is required'))
    }
    const password = req.body.password
    if (!_.isString(password)) {
      return next(HttpErrors.badRequest400('password is required'))
    }

    try {
      const authDoc = await MongoUtil.find(MongoUtil.AUTHENTICATION_COLLECTION, { email })
      if (!authDoc) {
        return next(HttpErrors.unauthorized401(`no user exists with email '${email}'`))
      }

      const result = await bcrypt.compare(password, authDoc.hash)
      if (!result) {
        return next(HttpErrors.unauthorized401('wrong password'))
      }

      const payload = {
        email,
      }
      const idToken = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: TOKEN_EXPIRES_IN_SECONDS,
      })

      res.status(200).send({
        email,
        idToken,
        expiresInMs: TOKEN_EXPIRES_IN_SECONDS * 1000,
      })
    } catch (exception) {
      next(exception)
    }
  })
}
