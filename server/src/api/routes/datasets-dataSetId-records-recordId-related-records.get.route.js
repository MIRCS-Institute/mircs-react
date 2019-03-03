/*
  - fetch the related records, as described by the Relationships pertaining to this DataSet
*/

const HttpErrors = require('../../utils/http-errors')

module.exports = (router) => {
  router.get('/api/datasets/:dataSetId/records/:recordId/related-records',
    (req, res, next) => {

      // TODO: implement

      next(HttpErrors.notImplemented501())
    })
}
