import { cachedServerHttpResource } from './resources/ServerHttpResource'
import CurrentResource from './resources/CurrentResource'
import UrlParams from '../states/UrlParams'

export const getViewRes = (viewId) => {
  if (viewId) {
    return cachedServerHttpResource(`/api/views/${viewId}`)
  }
}

class CurrentViewClass extends CurrentResource {
  createCurrentResourceInstance() {
    return getViewRes(UrlParams.get('viewId'))
  }
}

export const CurrentView = new CurrentViewClass()
