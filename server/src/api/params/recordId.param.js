/*
When a route defines :recordId in its path this param handler will look up and add the Data Set record object
to the Request object as `req.record`.
*/

const HttpErrors = require('../../utils/http-errors.js')
const MongoUtil = require('../../utils/mongo-util.js')
const ObjectID = require('mongodb').ObjectID

module.exports = (router) => {
  router.param('recordId', async (req, res, next, recordId) => {
    try {
      recordId = ObjectID(recordId)

      const collectionName = req.dataSet && req.dataSet._collectionName
      if (!collectionName) {
        return next(HttpErrors.notFound404('Data Set contains no _collectionName. dataSet: '+ JSON.stringify(req.dataSet)))
      }

      const records = await MongoUtil.find(req.dataSet._collectionName, { _id: recordId })
      req.record = records[0]
      next()
    } catch (exception) {
      return next(exception)
    }
  })
}
