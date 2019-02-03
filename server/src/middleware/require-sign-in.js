const HttpErrors = require('../utils/http-errors.js')

function requireSignIn(req, res, next) {
  if (!req.authentication) {
    return next(HttpErrors.forbidden403())
  }
  next()
}

module.exports = requireSignIn
