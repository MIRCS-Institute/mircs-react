const _ = require('lodash');
const log = require(__server_src_dir + 'utils/log.js');

const Environment = {};

const TYPE_BOOLEAN = 'boolean';
const TYPE_NUMBER = 'number';
const TYPE_STRING = 'string';

// list of configuration properties with meta information
const CONFIGURATION_VARS = {
  DEBUG: {
    default: 'false',
    type: TYPE_BOOLEAN,
    description: 'when set to true extra debug output is logged'
  },
  SERVER_PORT: {
    default: 80,
    type: TYPE_NUMBER,
    description: 'used to set the port acting as the http server'
  },
  MONGO_SERVER_URL: {
    default: 'mongodb://localhost:27017/',
    type: TYPE_STRING,
    description: 'MongoDB connection string - for details see https://docs.mongodb.org/manual/reference/connection-string/'
  },
};

let ENVIRONMENT_VALUES;

Environment.getConfigurationVars = function() {
  return _.clone(CONFIGURATION_VARS);
};

Environment.uninitializeConfigurationVariables = function() {
  ENVIRONMENT_VALUES = null;
};

Environment.initializeConfigurationVariables = function(configuration) {
  if (ENVIRONMENT_VALUES) {
    throw new Error('Attempting to initialize an Environment that is already initialized');
  }

  const missingValues = [];

  ENVIRONMENT_VALUES = {};
  _.forEach(CONFIGURATION_VARS, function(meta, key) {
    let value = configuration[key];
    if (_.isUndefined(value) || value === 'undefined') {
      value = meta.default;
    }
    if (_.isUndefined(value)) {
      var valueMessage = meta.description ? key + '\n (Description: ' + meta.description + ') \n' : key;

      missingValues.push(valueMessage);
      return;
    }

    // convert values from string, if necessary
    switch (meta.type) {
      case TYPE_BOOLEAN:
        value = (value === 'true');
        break;
      case TYPE_NUMBER:
        value = _.toNumber(value);
        break;
      case TYPE_STRING:
        value = value.trim();
        break;
      default:
        throw new Error(`unrecognized meta type for Environment key "${key}": ${meta.type}`);
    }

    ENVIRONMENT_VALUES[key] = value;
  });

  if (missingValues.length) {
    throw new Error('Missing values in configuration: ' + missingValues.join(', '));
  }
};

// Utility function for fetching a required path from the Environment object. An Error
// is thrown if the property is not found.
Environment.getRequired = function getRequired(path) {
  if (!ENVIRONMENT_VALUES) {
    Environment.initializeConfigurationVariables(process.env);

    if (ENVIRONMENT_VALUES.DEBUG) {
      log.level(log.TRACE);
      const toPrint = _.clone(ENVIRONMENT_VALUES);
      _.each(CONFIGURATION_VARS, function(meta, key) {
        if (meta.redactOnPrint) {
          toPrint[key] = '[REDACTED]';
        }
      });
      log.debug('available to server via Environment.getRequired() api:', JSON.stringify(toPrint, null, 2));
    }
  }

  const value = _.get(ENVIRONMENT_VALUES, path);
  if (_.isUndefined(value)) {
    const errorMessage = `Missing required Environment path: ${path}`;
    throw new Error(errorMessage);
  }
  return value;
};

module.exports = Environment;