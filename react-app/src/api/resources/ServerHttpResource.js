import { action, extendObservable } from 'mobx'
import _ from 'lodash'
import AbstractResource from './AbstractResource'
import LRU from 'lru-cache'
import ResourceState from './ResourceState'
import ServerHttpApi from '../net/ServerHttpApi'

const _cachedServerHttpResource = new LRU({ max: 1000 })

export function cachedServerHttpResource(path, emptyValue = {}) {
  let resource = _cachedServerHttpResource.get(path)
  if (!resource) {
    resource = new ServerHttpResource(path, emptyValue)
    _cachedServerHttpResource.set(path, resource)
  }
  return resource
}

class ServerHttpResource extends AbstractResource {
  // `emptyValue` becomes the current value for this resource when it cannot be fetched.
  constructor(path, emptyValue = {}) {
    if (path[0] !== '/') {
      throw new Error('path must start with /')
    }

    super()
    extendObservable(this, {
      _current: emptyValue,
    })

    this._path = path
    this._emptyValue = emptyValue
    this.refresh()
  }

  get path() {
    return this._path
  }

  refresh = () => {
    return ServerHttpApi.jsonGet(this._path)
      .then(action((response) => {
        this._current = response.bodyJson
        this.error = null
        this.state = ResourceState.READY
      }))
      .catch(action((error) => {
        if (error instanceof TypeError && this.state === ResourceState.READY) {
          // when refreshing a resource previously marked READY ignore network errors
          return Promise.resolve()
        } else if (_.get(error, 'status') === 404) {
          // treat missing resource as an empty value
          this._current = this._emptyValue
          this.state = ResourceState.READY
        } else {
          this.error = error
          this.state = ResourceState.ERROR
          this._current = this._emptyValue
        }
      }))
  }

  current() {
    return this._current
  }
}

export default ServerHttpResource
