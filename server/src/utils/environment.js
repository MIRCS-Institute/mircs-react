const _ = require('lodash')
const log = require('../utils/log.js')

const TYPE_BOOLEAN = 'boolean'
const TYPE_NUMBER = 'number'
const TYPE_STRING = 'string'

// list of configuration properties with meta information
const CONFIGURATION_VARS = {
  DEBUG: {
    default: 'false',
    type: TYPE_BOOLEAN,
    description: 'set to true to see extra debug output',
  },
  PORT: {
    default: 8001,
    type: TYPE_NUMBER,
    description: 'used to set the port acting as the http server',
  },
  MONGO_SERVER_URL: {
    default: 'mongodb://localhost:27017/mircsdb',
    type: TYPE_STRING,
    description: 'MongoDB connection string - for details see https://docs.mongodb.org/manual/reference/connection-string/',
  },
  JWT_SECRET_KEY: {
    default: 'mongodb://localhost:27017/mircsdb3nYZHW9zguCUvpQWYtfFAF3H3GRdYSaF5vhw3qGaM7rTFKErFf82de4YvPDeWJgBNvPxxVva4s7FmzrrtksczczrMzweEU5hXVJqyerhAhha7FDeU9v5WZPFaNxhWKJpdN3RYZhgsDwTt2x5DEhr3rxz6wMB83PNCD6DbuDWaXKw4pBpGyY5aettHMsDe6Xk8Bk7ZmdxkDd9pTVWtDhf85dQSMwZZrJ9xFZthAMhSuf3Bkb6zxnUDpUga33jvZKsPRYpkXuZ8cr2T7UgVp66B6uK33EWHed2EsPX78ckn2nz',
    type: TYPE_STRING,
    description: 'used to encrypt JSON Web Tokens - use a strong key greater than 256 bytes in length',
  },
}

let ENVIRONMENT_VALUES

function getConfigurationVars() {
  return _.clone(CONFIGURATION_VARS)
}

function uninitializeConfigurationVariables() {
  ENVIRONMENT_VALUES = null
}

function initializeConfigurationVariables(configuration) {
  if (ENVIRONMENT_VALUES) {
    throw new Error('Attempting to initialize an Environment that is already initialized')
  }

  const missingValues = []

  ENVIRONMENT_VALUES = {}
  _.forEach(CONFIGURATION_VARS, function(meta, key) {
    let value = configuration[key]
    if (_.isUndefined(value) || value === 'undefined') {
      value = meta.default
    }
    if (_.isUndefined(value)) {
      var valueMessage = meta.description ? key + '\n (Description: ' + meta.description + ') \n' : key

      missingValues.push(valueMessage)
      return
    }

    // convert values from string, if necessary
    switch (meta.type) {
      case TYPE_BOOLEAN:
        value = (value === 'true')
        break
      case TYPE_NUMBER:
        value = _.toNumber(value)
        break
      case TYPE_STRING:
        value = value.trim()
        break
      default:
        throw new Error(`unrecognized meta type for Environment key "${key}": ${meta.type}`)
    }

    ENVIRONMENT_VALUES[key] = value
  })

  if (missingValues.length) {
    throw new Error('Missing values in configuration: ' + missingValues.join(', '))
  }
}

// Utility function for fetching a required path from the Environment object. An Error
// is thrown if the property is not found.
function getRequired(path) {
  if (!ENVIRONMENT_VALUES) {
    initializeConfigurationVariables(process.env)

    if (ENVIRONMENT_VALUES.DEBUG) {
      log.level(log.TRACE)
      const toPrint = _.clone(ENVIRONMENT_VALUES)
      _.each(CONFIGURATION_VARS, function(meta, key) {
        if (meta.redactOnPrint) {
          toPrint[key] = '[REDACTED]'
        }
      })
      log.debug('available to server via Environment.getRequired() api:', JSON.stringify(toPrint, null, 2))
    }
  }

  const value = _.get(ENVIRONMENT_VALUES, path)
  if (_.isUndefined(value)) {
    const errorMessage = `Missing required Environment path: ${path}`
    throw new Error(errorMessage)
  }
  return value
}

module.exports = {
  getRequired,
  getConfigurationVars,
  uninitializeConfigurationVariables,
  initializeConfigurationVariables,
}
