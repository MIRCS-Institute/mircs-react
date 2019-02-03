const _ = require('lodash');

const Environment = {};

const TYPE_BOOLEAN = 'boolean';
const TYPE_STRING = 'string';

// list of configuration properties with meta information
const CONFIGURATION_VARS = {
  DEBUG: {
    default: 'false',
    type: TYPE_BOOLEAN,
    description: 'when set to true extra debug output is logged',
  },
  SERVER_URL: {
    default: '',
    type: TYPE_STRING,
    description: 'mircs api server url',
  },
}

let ENVIRONMENT_VALUES;

// NODE_ENV is a special value set by react-scripts, set to 'development' during `react-scripts start`
Environment.isLocalReactDevServer = function() {
  return (process.env.NODE_ENV === 'development');
};

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
    let value = configuration['REACT_APP_' + key];
    if (_.isUndefined(value) || value === 'undefined') {
      value = meta.default;
    }
    if (_.isUndefined(value)) {
      missingValues.push(key);
      return;
    }

    // convert values from string, if necessary
    switch (meta.type) {
      case TYPE_BOOLEAN:
        value = (value === 'true');
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
    let errorMessage = 'Missing values in configuration:\n ' + missingValues.join('\n ');
    if (Environment.isLocalReactDevServer()) {
      errorMessage = '*** Restart React dev server on command line. ***\n\n' + errorMessage;
    }
    throw new Error(errorMessage);
  }

  const extraValues = getExtraConfigurationValues(configuration);
  if (extraValues.length) {
    throw new Error('Extra values found in configuration:\n ' + extraValues.join('\n ') + '\n\n' +
      'Check /.env file and remove any REACT_APP_ declarations.\n' +
      'Check REACT_APP_ environment variables in your terminal.\n' +
      'Use Environment.js for all configuration values.\n' +
      'Restart CLI.');
  }

  // the DEBUG flag is special - if we're running a local dev server (i.e. `npm start`) and have not explicitly disabled DEBUG
  // then we set it to true
  if (Environment.isLocalReactDevServer() && _.isUndefined(process.env.REACT_APP_DEBUG)) {
    ENVIRONMENT_VALUES.DEBUG = true;
  }
};

function getExtraConfigurationValues(configuration) {
  const extraValues = [];
  _.each(configuration, function(value, key) {
    _.noop(value);
    if (_.startsWith(key, 'REACT_APP_')) {
      var convertedKey = key.substring('REACT_APP_'.length);
      if (!CONFIGURATION_VARS[convertedKey]) {
        extraValues.push(key);
      }
    }
  });
  return extraValues;
}

// Utility function for fetching a required path from the Environment object. An Error is thrown if the property is not found.
Environment.getRequired = function getRequired(path) {
  if (!ENVIRONMENT_VALUES) {
    Environment.initializeConfigurationVariables(process.env);

    if (ENVIRONMENT_VALUES.DEBUG) {
      // both configuration and ENVIRONMENT_VALUES are printed in debug versions so we can explicitly see all the values
      // being statically compiled into the app by react-scripts to ensure no values that shouldn't be here exist
      if (process.browser) {
        console.log('DEBUG: process.env included in the web app:', JSON.stringify(process.env, null, 2));
      }
      console.log('DEBUG: available to web app via Environment.getRequired() api:', JSON.stringify(ENVIRONMENT_VALUES, null, 2));
    }
  }

  const value = _.get(ENVIRONMENT_VALUES, path);
  if (_.isUndefined(value)) {
    const errorMessage = `Missing required Environment path: ${path}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  return value;
};

module.exports = Environment;