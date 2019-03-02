const MongoUtil = require('../../utils/mongo-util.js')

module.exports = (router) => {
  router.param('viewId', async (req, res, next, viewId) => {
    try {
      req.dataSet = await MongoUtil.findById(MongoUtil.VIEWS_COLLECTION, viewId)
      next()
    } catch (exception) {
      return next(exception)
    }
  })
}
