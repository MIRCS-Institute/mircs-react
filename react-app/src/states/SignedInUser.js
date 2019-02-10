import { action, computed, extendObservable } from 'mobx'
import _ from 'lodash'
import Environment from '../utils/Environment'
import LocalStorage from '../utils/LocalStorage'
import ServerHttpApi from '../api/net/ServerHttpApi'

const SERVER_URL = Environment.getRequired('SERVER_URL')
const MIRCS_USER_STORAGE_KEY = `mircs-user-${SERVER_URL}`

class SignedInUserClass {
  constructor() {
    extendObservable(this, {
      _authRecord: null,
    })
    this._computedValues = {}
    action(() => {
      this._authRecord = LocalStorage.getObject(MIRCS_USER_STORAGE_KEY)
    })()
  }

  get = (key) => {
    let computedValue = this._computedValues[key]
    if (!computedValue) {
      computedValue = computed(() => {
        return _.get(this._authRecord, key)
      })
      this._computedValues[key] = computedValue
    }
    return computedValue.get()
  }

  isSignedIn = () => {
    return !!this.get('userId')
  }

  signOut = async () => {
    // wipe all user and non-user data from local storage
    LocalStorage.clear()
    action(() => {
      this._authRecord = null
    })()
  }

  signIn = async (email, password) => {
    const response = await ServerHttpApi.jsonPost('/auth/verify-password', { email, password })
    const authRecord = response.bodyJson
    LocalStorage.setObject(MIRCS_USER_STORAGE_KEY, authRecord)
    action(() => {
      this._authRecord = authRecord
    })()
    return response.bodyJson
  }
}

const SignedInUser = new SignedInUserClass()

export default SignedInUser
