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

const makeRequest = async (path, request) => {
  if (!_.isString(path)) {
    throw new Error('path is required')
  }
  if (!_.isPlainObject(request)) {
    throw new Error('request is required')
  }

  const serverRequest = _.cloneDeep(request)

  const idToken = SignedInUser.get('idToken')
  if (idToken) {
    _.set(serverRequest, 'headers.Authorization', `Bearer ${idToken}`)
  }

  const url = SERVER_URL + path

  try {
    return await http.jsonRequest(url, serverRequest)
  } catch (exception) {
    if (exception.status === 401 && _.get(exception.bodyJson, 'message') === 'token expired') {
      // until we implement a token renewal strategy we simply sign the user out when their
      // token expires
      SignedInUser.signOut()
      // retry the original request after sign out
      return makeRequest(path, request)
    } else {
      throw exception
    }
  }
}

export default {
  jsonGet,
  jsonPost,
  jsonPut,
  jsonDelete,
}
