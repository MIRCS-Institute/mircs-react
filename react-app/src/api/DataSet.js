import { cachedServerHttpResource } from './resources/ServerHttpResource'
import CurrentResource from './resources/CurrentResource'
import UrlParams from '../states/UrlParams'

export const getDataSetRes = (dataSetId) => {
  if (dataSetId) {
    return cachedServerHttpResource(`/api/datasets/${dataSetId}`)
  }
}

class CurrentDataSetClass extends CurrentResource {
  createCurrentResourceInstance() {
    return getDataSetRes(UrlParams.get('dataSetId'))
  }
}

export const CurrentDataSet = new CurrentDataSetClass()
