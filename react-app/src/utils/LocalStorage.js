import _ from 'lodash'

/**
 * Utility methods to ease using window.localStorage for objects.
 */

const DEBUG_LOCAL_STORAGE = false

// Returns a list of keys available in window.localStorage.
function keys() {
  return Object.keys(window.localStorage)
}

// Calculates the approximate space occupied by LocalStorage.
function size() {
  var size = 0
  _.each(keys(), function(key) {
    size += key.length
    size += window.localStorage.getItem(key).length
  })
  return size
}

// Sets a string value in LocalStorage. For more complete type support, use setObject.
function setString(key, value) {
  window.localStorage.setItem(key, value)

  if (DEBUG_LOCAL_STORAGE) {
    console.log('SET "' + key + '",',
      value ? (value.length.toLocaleString() + ' bytes in storage') : 'no value in storage',
      getInfoLogString())
  }
}


// Retrieves a string value from LocalStorage. For more complete type support, use LocalStorage.getObject.
function getString(key, defaultValue) {
  var value = window.localStorage.getItem(key) || defaultValue
  if (DEBUG_LOCAL_STORAGE) {
    console.log('GET "' + key + '"',
      value ? (value.length.toLocaleString() + ' bytes in storage') : 'no value in storage',
      getInfoLogString())
  }
  return value
}

// Removes a single data entry from LocalStorage.
function remove(key) {
  window.localStorage.removeItem(key)
}

// Clears all data stored in LocalStorage. Use with care.
function clear() {
  if (DEBUG_LOCAL_STORAGE) {
    console.log('Clearing LocalStorage.')
  }

  window.localStorage.clear()
}

// Serializes a JSON stringified version to LocalStorage.
function setObject(key, value) {
  setString(key, JSON.stringify(value))
}

// Retrieves and parses a JSON value from LocalStorage.
function getObject(key, defaultValue) {
  let result = defaultValue
  let string = getString(key)
  if (string) {
    try {
      result = JSON.parse(string)
    } catch (exception) {
      console.error('Error parsing json value:', string, exception.stack || exception)
      remove(key)
    }
  }
  return result
}

function getInfoLogString() {
  return ['- LocalStorage:',
    keys().length.toLocaleString(), 'entries,',
    size().toLocaleString(), 'bytes',
  ].join(' ')
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  keys,
  size,
  setString,
  getString,
  remove,
  clear,
  setObject,
  getObject,
}
