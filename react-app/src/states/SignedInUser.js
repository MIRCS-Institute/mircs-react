import { action, computed, extendObservable, toJS } from 'mobx'
import _ from 'lodash'
import Environment from '../utils/Environment'
import http from '../utils/http'
import LocalStorage from '../utils/LocalStorage'

const SERVER_URL = Environment.getRequired('SERVER_URL')

const MIRCS_USER_STORAGE_KEY = `mircs-user-${SERVER_URL}`

class SignedInUserClass {
  constructor() {
    extendObservable(this, {
      _authRecord: null,
    })
    this._loadFromLocalStorage()
  }

  _loadFromLocalStorage = action(() => {
    this._authRecord = LocalStorage.getObject(MIRCS_USER_STORAGE_KEY)
    console.log('this._authRecord:', toJS(this._authRecord))
  })

  _userIdComputed = computed(() => {
    return _.get(this._authRecord, 'userId')
  })

  getUserId = () => {
    return this._userIdComputed.get()
  }

  authRecord = () => {
    return toJS(this._authRecord)
  }

  _emailComputed = computed(() => {
    return _.get(this._authRecord, 'email')
  })

  getEmail = () => {
    return this._emailComputed.get()
  }

  _isSignedInComputed = computed(() => {
    return !!_.get(this._authRecord, 'userId')
  })

  isSignedIn = () => {
    return this._isSignedInComputed.get()
  }

  signOut = async () => {
    // wipe all user and non-user data from local storage
    LocalStorage.clear()
    action(() => {
      this._authRecord = null
    })()
  }

  signIn = async (email, password) => {
    const response = await http.jsonRequest(`${SERVER_URL}/auth/verify-password`, {
      method: 'POST',
      bodyJson: { email, password },
    })
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
