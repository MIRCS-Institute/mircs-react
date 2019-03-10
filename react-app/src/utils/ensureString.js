import _ from 'lodash'

const ensureString = (object, field) => {
  if (!_.isString(object[field])) {
    object[field] = ''
  }
}

export default ensureString
