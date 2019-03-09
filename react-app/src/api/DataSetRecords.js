import { cachedServerHttpResource } from './resources/ServerHttpResource'
import { getCurrentDataSetId } from './DataSet'
import CurrentResource from './resources/CurrentResource'

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
    const dataSetId = getCurrentDataSetId()
    return getDataSetRecordsRes(dataSetId)
  }
}

export const CurrentDataSetRecords = new CurrentDataSetRecordsClass()
