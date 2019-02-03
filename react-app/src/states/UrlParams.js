import { action, computed, extendObservable, toJS } from 'mobx'

class UrlParamsClass {
  constructor() {
    extendObservable(this, {
      _params: {},
    })
    this._computed = {}
  }

  // Gets UrlParam from the unwatched list but always references the mobx resource to trigger dependencies on UrlParam updates.
  // If `param` is undefined the entire params object is returned.
  get = (param) => {
    if (param) {
      let computedParam = this._computed[param]
      if (!computedParam) {
        this._computed[param] = computedParam = computed(() => {
          return this._params[param]
        })
      }

      return computedParam.get()
    }
    return toJS(this._params)
  }

  // Sets the UrlParams state.
  set = action((params) => {
    this._params = params
  })
}

const UrlParams = new UrlParamsClass()

export default UrlParams
