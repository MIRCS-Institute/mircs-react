import _ from 'lodash'

export default function getErrorMessage(error) {
  let errorMessage = '' + error
  if (errorMessage === '[object Object]') {
    errorMessage = _.get(error, 'error', JSON.stringify(error))
  }
  return errorMessage
}
