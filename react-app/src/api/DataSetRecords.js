import { cachedServerHttpResource } from './resources/ServerHttpResource'
import CurrentResource from './resources/CurrentResource'
import UrlParams from '../states/UrlParams'

export const getDataSetRecordsRes = (dataSetId) => {
  if (dataSetId) {
    return cachedServerHttpResource(`/api/datasets/${dataSetId}/records`)
  }
}

class CurrentDataSetRecordsClass extends CurrentResource {
  constructor() {
    super([])
  }
  createCurrentResourceInstance() {
    return getDataSetRecordsRes(UrlParams.get('dataSetId'))
  }
}

export const CurrentDataSetRecords = new CurrentDataSetRecordsClass()
