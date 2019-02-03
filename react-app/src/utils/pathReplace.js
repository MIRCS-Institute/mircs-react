import _ from 'lodash'

function pathReplace(path, params) {
  _.each(_.keys(params), key => {
    if (params[key]) {
      path = _.replace(path, ':' + key, params[key])
    }
  })
  return path
}

export default pathReplace
