import { cachedServerHttpResource } from './resources/ServerHttpResource'

export const getRelationshipsRes = () => {
  return cachedServerHttpResource('/api/relationships')
}
