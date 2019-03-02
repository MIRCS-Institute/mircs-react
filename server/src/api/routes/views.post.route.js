const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.post('/api/views',
    require('../../middleware/require-sign-in'),
    async function(req, res, next) {
      const newView = req.body
      try {
        MongoUtil.validateView(newView)
      } catch (exception) {
        return res.status(400).send(exception.message)
      }

      try {
        newView.createdAt = newView.updatedAt = new Date()
        const insertedView = await MongoUtil.insertIntoCollection(
          MongoUtil.VIEWS_COLLECTION, newView)

        res.status(201).send(insertedView)
      } catch (exception) {
        return next(exception)
      }
    })
}
