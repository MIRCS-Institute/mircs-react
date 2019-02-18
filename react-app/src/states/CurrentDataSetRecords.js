import { cachedServerHttpResource } from '../api/resources/ServerHttpResource'
import CurrentResource from '../api/resources/CurrentResource'
import UrlParams from './UrlParams'

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
