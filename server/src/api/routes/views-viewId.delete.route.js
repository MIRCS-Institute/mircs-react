const MongoUtil = require('../../utils/mongo-util.js')

module.exports = (router) => {
  router.delete('/api/views/:viewId',
    require('../../middleware/require-sign-in'),
    async (req, res, next) => {
      try {
        await MongoUtil.deleteById(MongoUtil.VIEWS_COLLECTION, req.params.viewId)
        res.status(200).send({ result: 'deleted' })
      } catch (exception) {
        next(exception)
      }
    })
}
