const HttpStatusCode = require('../utils/http-status-code.js')

function badRequest400(message) {
  const error = new Error(message)
  error.status = HttpStatusCode.BAD_REQUEST_400
  return error
}

function unauthorized401(message) {
  const error = new Error(message)
  error.status = HttpStatusCode.UNAUTHORIZED_401
  return error
}

function paymentRequired402(message) {
  const error = new Error(message)
  error.status = HttpStatusCode.PAYMENT_REQUIRED_402
  return error
}

function forbidden403(message) {
  const error = new Error(message)
  error.status = HttpStatusCode.FORBIDDEN_403
  return error
}

function notFound404(message) {
  const error = new Error(message)
  error.status = HttpStatusCode.NOT_FOUND_404
  return error
}

module.exports = {
  badRequest400,
  unauthorized401,
  forbidden403,
  paymentRequired402,
  notFound404,
}
