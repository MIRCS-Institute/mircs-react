/*
When a route defines :recordId in its path this param handler will look up and add the Data Set record object
to the Request object as `req.record`.
*/

const MongoUtil = require('../../utils/mongo-util.js')
const ObjectID = require('mongodb').ObjectID

module.exports = function(router) {
  router.param('recordId', function(req, res, next, recordId) {
    try {
      recordId = ObjectID(recordId)
    } catch (exception) {
      return next(exception)
    }

    const collectionName = req.dataSet && req.dataSet._collectionName
    if (!collectionName) {
      return next(new Error('Data Set contains no _collectionName. dataSet: '+ JSON.stringify(req.dataSet)))
    }

    MongoUtil.find(req.dataSet._collectionName, { _id: recordId })
      .then((records) => {
        req.record = records[0]
        next()
      }, next)
  })
}
