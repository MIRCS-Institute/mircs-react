const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.delete('/api/views/:viewId',
    require('../../middleware/require-sign-in'),
    async function(req, res, next) {
      const viewId = req.params.viewId
      if (!req.view) {
        return res.status(404).send({ error: 'No View found with id ' + viewId })
      }

      try {
        await MongoUtil.deleteById(MongoUtil.VIEWS_COLLECTION, viewId)
        res.status(200).send({ result: 'deleted' })
      } catch (exception) {
        next(exception)
      }
    })
}
