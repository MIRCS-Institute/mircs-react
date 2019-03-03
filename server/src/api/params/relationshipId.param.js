/*
When a route defines :relationshipId in its path this param handler will look up and add the Relationship descriptor object
to the Request object as `req.dataSet`.
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = (router) => {
  router.param('relationshipId', async (req, res, next, relationshipId) => {
    try {
      const _id = MongoUtil.toObjectID(relationshipId)
      const dataSets = await MongoUtil.find(MongoUtil.RELATIONSHIPS_COLLECTION, { _id })
      req.relationship = dataSets[0]
      next()
    } catch(exception) {
      next(exception)
    }
  })
}
