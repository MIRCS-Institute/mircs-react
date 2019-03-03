/*
When a route defines :dataSetId in its path this param handler will look up and add the Data Set descriptor object
to the Request object as `req.dataSet`.
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = (router) => {
  router.param('dataSetId', async (req, res, next, dataSetId) => {
    try {
      const _id = MongoUtil.toObjectID(dataSetId)
      const dataSets = await MongoUtil.find(MongoUtil.DATA_SETS_COLLECTION, { _id })
      req.dataSet = dataSets[0]
      next()
    } catch (exception) {
      return next(exception)
    }
  })
}
