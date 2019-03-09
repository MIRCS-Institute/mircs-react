import { cachedServerHttpResource } from './resources/ServerHttpResource'
import { getCurrentDataSetId } from './DataSet'
import CurrentResource from './resources/CurrentResource'

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
    const dataSetId = getCurrentDataSetId()
    return getDataSetFieldsRes(dataSetId)
  }
}

export const CurrentDataSetFields = new CurrentDataSetFieldsClass()
