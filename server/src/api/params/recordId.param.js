/*
When a route defines :recordId in its path this param handler will look up and add the Data Set record object
to the Request object as `req.record`.
*/

const HttpErrors = require('../../utils/http-errors.js')
const DataUtil = require('../../utils/data-util.js')

module.exports = (router) => {
  router.param('recordId', async (req, res, next, recordId) => {
    try {
      const _id = DataUtil.toObjectId(recordId)
      const collectionName = req.dataSet && req.dataSet._collectionName
      if (!collectionName) {
        return next(HttpErrors.internalServerError500(`Data Set contains no _collectionName. dataSet: ${JSON.stringify(req.dataSet)}`))
      }

      const records = await DataUtil.find(req.dataSet._collectionName, { _id })
      req.record = records[0]
      if (!req.record) {
        return next(HttpErrors.notFound404(`No Record found with id '${recordId}'`))
      }
      next()
    } catch (exception) {
      return next(exception)
    }
  })
}
