import { extendObservable } from 'mobx'
import _ from 'lodash'
import ResourceState from './ResourceState'

class AbstractResource {
  constructor() {
    extendObservable(this, {
      state: ResourceState.PENDING,
      error: null,
    })
  }

  current() {
    throw new Error('must be implemented by subclass')
  }

  get(path, defaultValue) {
    return _.get(this.current(), path, defaultValue)
  }

  get isPending() {
    return this.state === ResourceState.PENDING
  }

  get isReady() {
    return this.state === ResourceState.READY
  }

  get isError() {
    return this.state === ResourceState.ERROR
  }

  match(methods) {
    // calling `current()` before the switch to register any callers of `match()` as dependent on
    // the mobx resource
    const current = this.current()

    switch (this.state) {
      case ResourceState.PENDING:
        if (_.isFunction(methods && methods.pending)) {
          return methods.pending()
        }
        break
      case ResourceState.READY:
        if (_.isFunction(methods && methods.ready)) {
          return methods.ready(current)
        }
        break
      case ResourceState.ERROR:
        if (_.isFunction(methods && methods.error)) {
          return methods.error(this.error)
        }
        break
      default:
        // ignored
    }
  }
}

export default AbstractResource
