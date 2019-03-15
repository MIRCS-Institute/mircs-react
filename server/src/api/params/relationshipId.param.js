/*
When a route defines :relationshipId in its path this param handler will look up and add the Relationship descriptor object
to the Request object as `req.dataSet`.
*/

const HttpErrors = require('../../utils/http-errors')
const DataUtil = require('../../utils/data-util.js')

module.exports = (router) => {
  router.param('relationshipId', async (req, res, next, relationshipId) => {
    try {
      const _id = DataUtil.toObjectID(relationshipId)
      const dataSets = await DataUtil.find(DataUtil.RELATIONSHIPS_COLLECTION, { _id })
      req.relationship = dataSets[0]
      if (!req.relationship) {
        return next(HttpErrors.notFound404(`No Relationship found with id '${relationshipId}'`))
      }
      next()
    } catch(exception) {
      next(exception)
    }
  })
}
