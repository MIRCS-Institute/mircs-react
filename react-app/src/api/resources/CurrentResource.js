import { action, autorun, extendObservable } from 'mobx'
import ValueResource from './ValueResource'

class CurrentResource {
  // `defaultValue` is used as the current value when no resource is found
  constructor(defaultValue = {}) {
    extendObservable(this, {
      _resource: null,
    })

    this.valueResource = new ValueResource(defaultValue)

    autorun(() => {
      let resource = this.createCurrentResourceInstance()
      action(() => {
        this._resource = resource
      })()
    })
  }

  createCurrentResourceInstance() {
    throw new Error('must be implemented by subclass')
  }

  get res() {
    return this._resource || this.valueResource
  }
}

export default CurrentResource
