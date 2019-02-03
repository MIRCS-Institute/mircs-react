/*
When a route defines :dataSetId in its path this param handler will look up and add the Data Set descriptor object
to the Request object as `req.dataSet`.
*/

const MongoUtil = require('../../utils/mongo-util.js')
const ObjectID = require('mongodb').ObjectID

module.exports = (router) => {
  router.param('dataSetId', async (req, res, next, dataSetId) => {
    try {
      dataSetId = ObjectID(dataSetId)

      const dataSet = await MongoUtil.findOne(MongoUtil.DATA_SETS_COLLECTION, { _id: dataSetId })
      req.dataSet = dataSet
      next()
    } catch (exception) {
      return next(exception)
    }
  })
}
