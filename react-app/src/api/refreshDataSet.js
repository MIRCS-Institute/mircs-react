import { getDataSetFieldsRes } from './DataSetFields'
import { getDataSetRecordsRes } from './DataSetRecords'
import { getDataSetRes } from './DataSet'
import { getDataSetsRes } from './DataSets'
import { getDataSetStatsRes } from './DataSetStats'
import { showSnackbarMessage } from '../components/SnackbarMessages'

export const refreshDataSet = (dataSetId) => {
  let promises
  if (dataSetId) {
    promises = [
      getDataSetsRes().refresh(),
      getDataSetRes(dataSetId).refresh(),
      getDataSetFieldsRes(dataSetId).refresh(),
      getDataSetRecordsRes(dataSetId).refresh(),
      getDataSetStatsRes(dataSetId).refresh(),
    ]
  } else {
    promises = [
      getDataSetsRes().refresh(),
    ]
  }

  return Promise.all(promises)
    .catch(showSnackbarMessage)
}
