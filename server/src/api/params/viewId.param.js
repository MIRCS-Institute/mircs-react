const HttpErrors = require('../../utils/http-errors')
const MongoUtil = require('../../utils/mongo-util.js')

module.exports = (router) => {
  router.param('viewId', async (req, res, next, viewId) => {
    try {
      req.view = await MongoUtil.findById(MongoUtil.VIEWS_COLLECTION, viewId)
      if (!req.view) {
        return next(HttpErrors.notFound404(`No View found with id '${viewId}'`))
      }
      next()
    } catch (exception) {
      return next(exception)
    }
  })
}
