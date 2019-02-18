import AbstractResource from './AbstractResource'
import ResourceState from './ResourceState'

// Wraps a value in a Resource construct.
class ValueResource extends AbstractResource {
  constructor(value) {
    super()
    this.state = ResourceState.READY
    this.value = value
  }

  current() {
    return this.value
  }
}

export default ValueResource
