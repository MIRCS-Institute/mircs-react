const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.get('/api/views',
    async function(req, res, next) {
      try {
        const list = await MongoUtil.find(MongoUtil.VIEWS_COLLECTION, {})
        res.status(200).send({ list })
      } catch (exception) {
        next(exception)
      }
    })
}
