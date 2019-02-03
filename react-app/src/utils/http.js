import _ from 'lodash'
import Environment from '../utils/Environment'

const DEBUG = Environment.getRequired('DEBUG')

const http = {}

/*
Convenience function that wraps the window.fetch API to make a JSON request to @url.
@request can be used to configure the connection, for example to make a PUT request specify { method: 'put' }.
If request.body is a JS object, it will be converted to a JSON string before being sent in the request.

Returns a Promise that resolves to a Response object with some extra properties:
    - response.bodyText: contains the response body text
    - response.bodyJson: contains the response body parsed as a JS object

If the response status code is not 2** then the Promise is rejected.

@see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

http.jsonRequest = function (url, request) {
  request = _.extend({
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json',
    },
  }, request)

  if (request.bodyJson && !request.body) {
    request.body = JSON.stringify(request.bodyJson)
  }

  return window.fetch(url, request)
    .then(function (response) {
      return response.text().then(function (text) {
        response.bodyText = text

        try {
          response.bodyJson = JSON.parse(text)

          if (response.status < 200 || response.status >= 300) {
            if (DEBUG) {
              console.error('http.jsonRequest: error response:',
                '\n    url:', url,
                '\n    request:', request,
                '\n    response:', response)
            }
            return Promise.reject(new Error(`${response.status}: ${response.bodyText}`))
          }

          if (DEBUG) {
            console.log('http.jsonRequest: success:',
              '\n    url:', url,
              '\n    request:', request,
              '\n    response:', response)
          }
        } catch (exception) {
          response.error = exception
          if (DEBUG) {
            console.error('http.jsonRequest: error parsing json response:',
              '\n    url:', url,
              '\n    request:', request,
              '\n    response:', response)
          }
          return Promise.reject(new Error(`${response.status}: ${response.bodyText}`))
        }

        return response
      })
    })
}

export default http
