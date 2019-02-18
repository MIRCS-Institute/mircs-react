import { cachedServerHttpResource } from './resources/ServerHttpResource'
import CurrentResource from './resources/CurrentResource'
import UrlParams from '../states/UrlParams'

export const getDataSetFieldsRes = (dataSetId) => {
  if (dataSetId) {
    return cachedServerHttpResource(`/api/datasets/${dataSetId}/fields`)
  }
}

class CurrentDataSetFieldsClass extends CurrentResource {
  constructor() {
    super([])
  }
  createCurrentResourceInstance() {
    return getDataSetFieldsRes(UrlParams.get('dataSetId'))
  }
}

export const CurrentDataSetFields = new CurrentDataSetFieldsClass()
