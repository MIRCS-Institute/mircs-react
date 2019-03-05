import { cachedServerHttpResource } from './resources/ServerHttpResource'
import { CurrentView } from './View'
import CurrentResource from './resources/CurrentResource'
import UrlParams from '../states/UrlParams'

export const getDataSetRes = (dataSetId) => {
  if (dataSetId) {
    return cachedServerHttpResource(`/api/datasets/${dataSetId}`)
  }
}

export const getCurrentDataSetId = () => {
  const dataSetId = UrlParams.get('dataSetId') || CurrentView.res.get('dataSetId')
  return dataSetId
}

class CurrentDataSetClass extends CurrentResource {
  createCurrentResourceInstance() {
    return getDataSetRes(getCurrentDataSetId())
  }
}

export const CurrentDataSet = new CurrentDataSetClass()
