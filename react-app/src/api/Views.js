import { cachedServerHttpResource } from './resources/ServerHttpResource'

export const getViewsRes = () => {
  return cachedServerHttpResource('/api/views')
}
