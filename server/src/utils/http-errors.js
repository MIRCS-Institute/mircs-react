const HttpStatusCode = require('../utils/http-status-code.js')

const badRequest400 = (message) => {
  const error = new Error(message)
  error.status = HttpStatusCode.BAD_REQUEST_400
  return error
}

const unauthorized401 = (message) => {
  const error = new Error(message)
  error.status = HttpStatusCode.UNAUTHORIZED_401
  return error
}

const paymentRequired402 = (message) => {
  const error = new Error(message)
  error.status = HttpStatusCode.PAYMENT_REQUIRED_402
  return error
}

const forbidden403 = (message) => {
  const error = new Error(message)
  error.status = HttpStatusCode.FORBIDDEN_403
  return error
}

const notFound404 = (message) => {
  const error = new Error(message)
  error.status = HttpStatusCode.NOT_FOUND_404
  return error
}

const internalServerError500 = (message) => {
  const error = new Error(message)
  error.status = HttpStatusCode.INTERNAL_SERVER_ERROR_500
  return error
}

const notImplemented501 = (message) => {
  const error = new Error(message)
  error.status = HttpStatusCode.NOT_IMPLEMENTED_501
  return error
}

module.exports = {
  badRequest400,
  unauthorized401,
  forbidden403,
  paymentRequired402,
  notFound404,
  internalServerError500,
  notImplemented501,
}
