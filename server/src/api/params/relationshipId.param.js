/*
When a route defines :relationshipId in its path this param handler will look up and add the Relationship descriptor object
to the Request object as `req.dataSet`.
*/

const MongoUtil = require('../../utils/mongo-util.js')
const ObjectID = require('mongodb').ObjectID

module.exports = (router) => {
  router.param('relationshipId', async (req, res, next, relationshipId) => {
    try {
      relationshipId = ObjectID(relationshipId)

      const dataSet = await MongoUtil.findOne(MongoUtil.RELATIONSHIPS_COLLECTION, { _id: relationshipId })
      req.relationship = dataSet
      next()
    } catch(exception) {
      next(exception)
    }
  })
}
