const _ = require('lodash')
const DataUtil = require('../../utils/data-util.js')

module.exports = (router) => {
  router.put('/api/views/:viewId',
    require('../../middleware/require-sign-in'),
    async (req, res, next) => {
      const updatedView = _.clone(req.body)
      try {
        DataUtil.validateView(updatedView)
      } catch (exception) {
        return res.status(400).send(exception.message)
      }

      try {
        // overwrite system fields from existing record
        updatedView._id = req.view._id
        updatedView.createdAt = req.view.createdAt
        updatedView.updatedAt = new Date()

        const db = await DataUtil.getDb()
        const viewCollection = db.collection(DataUtil.VIEWS_COLLECTION)
        await viewCollection.updateOne({ _id: updatedView._id }, updatedView)
        res.status(200).send(updatedView)
      } catch (exception) {
        return next(exception)
      }
    })
}
