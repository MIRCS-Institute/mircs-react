import { getViewRes } from './View'
import { getViewsRes } from './Views'
import { showSnackbarMessage } from '../components/SnackbarMessages'

export const refreshView = (viewId) => {
  let promises
  if (viewId) {
    promises = [
      getViewsRes().refresh(),
      getViewRes(viewId).refresh(),
    ]
  } else {
    promises = [
      getViewsRes().refresh(),
    ]
  }

  return Promise.all(promises)
    .catch(showSnackbarMessage)
}
