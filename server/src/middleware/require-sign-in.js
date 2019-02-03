/*
  - checks the existence of the req.authentication property
  - requires `decode-bearer-token.middleware.js` to execute first
*/

const HttpErrors = require('../utils/http-errors.js')

function requireSignIn(req, res, next) {
  if (!req.authentication) {
    return next(HttpErrors.forbidden403())
  }
  next()
}

module.exports = requireSignIn
