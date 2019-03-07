import { cachedServerHttpResource } from './resources/ServerHttpResource'
import { getCurrentDataSetId } from './DataSet'
import CurrentResource from './resources/CurrentResource'

export const getDataSetStatsRes = (dataSetId) => {
  if (dataSetId) {
    return cachedServerHttpResource(`/api/datasets/${dataSetId}/stats`)
  }
}

class CurrentDataSetStatsClass extends CurrentResource {
  createCurrentResourceInstance() {
    const dataSetId = getCurrentDataSetId()
    return getDataSetStatsRes(dataSetId)
  }
}

export const CurrentDataSetStats = new CurrentDataSetStatsClass()
