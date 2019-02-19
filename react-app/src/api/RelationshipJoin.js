import { cachedServerHttpResource } from './resources/ServerHttpResource'
import CurrentResource from './resources/CurrentResource'
import UrlParams from '../states/UrlParams'

export const getRelationshipJoinRes = (relationshipId) => {
  if (relationshipId) {
    return cachedServerHttpResource(`/api/relationships/${relationshipId}/join`)
  }
}

class CurrentRelationshipJoinClass extends CurrentResource {
  constructor() {
    super([])
  }
  createCurrentResourceInstance() {
    return getRelationshipJoinRes(UrlParams.get('relationshipId'))
  }
}

export const CurrentRelationshipJoin = new CurrentRelationshipJoinClass()
