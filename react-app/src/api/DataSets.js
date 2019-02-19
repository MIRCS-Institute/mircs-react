import { cachedServerHttpResource } from './resources/ServerHttpResource'

export const getDataSetsRes = () => {
  return cachedServerHttpResource('/api/datasets')
}
