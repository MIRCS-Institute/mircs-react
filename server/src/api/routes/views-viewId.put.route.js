const _ = require('lodash')
const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.put('/api/views/:viewId',
    require('../../middleware/require-sign-in'),
    async function(req, res, next) {
      if (!req.view) {
        return res.status(404).send({ error: 'No View found with id ' + req.params.viewId })
      }

      const updatedView = _.clone(req.body)
      try {
        MongoUtil.validateView(updatedView)
      } catch (exception) {
        return res.status(400).send(exception.message)
      }

      try {
        // overwrite system fields from existing record
        updatedView._id = req.view._id
        updatedView.createdAt = req.view.createdAt
        updatedView.updatedAt = new Date()

        const db = await MongoUtil.getDb()
        const viewCollection = db.collection(MongoUtil.VIEWS_COLLECTION)
        await viewCollection.updateOne({ _id: updatedView._id }, updatedView)
        res.status(200).send(updatedView)
      } catch (exception) {
        return next(exception)
      }
    })
}
