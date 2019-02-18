import { cachedServerHttpResource } from './resources/ServerHttpResource'
import CurrentResource from './resources/CurrentResource'
import UrlParams from '../states/UrlParams'

class CurrentDataSetRecordsClass extends CurrentResource {
  createCurrentResourceInstance() {
    const dataSetId = UrlParams.get('dataSetId')
    if (dataSetId) {
      return cachedServerHttpResource(`/api/datasets/${dataSetId}/records`)
    }
  }
}

const CurrentDataSetRecords = new CurrentDataSetRecordsClass()
export default CurrentDataSetRecords
