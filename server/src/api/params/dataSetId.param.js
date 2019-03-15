/*
When a route defines :dataSetId in its path this param handler will look up and add the Data Set descriptor object
to the Request object as `req.dataSet`.
*/

const HttpErrors = require('../../utils/http-errors.js')
const DataUtil = require('../../utils/data-util.js')

module.exports = (router) => {
  router.param('dataSetId', async (req, res, next, dataSetId) => {
    try {
      req.dataSet = await DataUtil.findById(DataUtil.DATA_SETS_COLLECTION, dataSetId)
      if (!req.dataSet) {
        return next(HttpErrors.notFound404(`No Data Set found with id '${dataSetId}'`))
      }
      const collectionName = req.dataSet._collectionName
      if (!collectionName) {
        return next(HttpErrors.internalServerError500(`Data Set contains no _collectionName. dataSet: ${JSON.stringify(req.dataSet)}`))
      }
      next()
    } catch (exception) {
      return next(exception)
    }
  })
}
