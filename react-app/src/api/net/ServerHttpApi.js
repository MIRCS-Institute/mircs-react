import _ from 'lodash'
import Environment from '../../utils/Environment'
import http from '../../utils/http'
import SignedInUser from '../../states/SignedInUser'

const SERVER_URL = Environment.getRequired('SERVER_URL')

const JSON_HEADER = { 'Content-Type': 'application/json' }

const jsonGet = (path) => {
  return makeRequest(path, { method: 'GET', headers: JSON_HEADER })
}

const jsonPost = (path, bodyJson) => {
  return makeRequest(path, { method: 'POST', headers: JSON_HEADER, bodyJson })
}

const jsonPut = (path, bodyJson) => {
  return makeRequest(path, { method: 'PUT', headers: JSON_HEADER, bodyJson })
}

const jsonDelete = (path) => {
  return makeRequest(path, { method: 'DELETE', headers: JSON_HEADER })
}

const makeRequest = (path, request) => {
  if (!_.isString(path)) {
    throw new Error('path is required')
  }
  if (!_.isPlainObject(request)) {
    throw new Error('request is required')
  }

  const idToken = SignedInUser.get('idToken')
  if (idToken) {
    _.set(request, 'headers.Authorization', `Bearer ${idToken}`)
  }

  _.set(request, 'headers.X-Client-Platform', window.navigator.platform)
  _.set(request, 'headers.X-User-Agent', window.navigator.userAgent)

  const url = SERVER_URL + path

  return http.jsonRequest(url, request)
}

export default {
  jsonGet,
  jsonPost,
  jsonPut,
  jsonDelete,
}
