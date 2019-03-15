const DataUtil = require('../../utils/data-util.js')

module.exports = function(router) {
  router.post('/api/views',
    require('../../middleware/require-sign-in'),
    async (req, res, next) => {
      const newView = req.body
      try {
        DataUtil.validateView(newView)
      } catch (exception) {
        return res.status(400).send(exception.message)
      }

      try {
        newView.createdAt = newView.updatedAt = new Date()
        const insertedView = await DataUtil.insertIntoCollection(
          DataUtil.VIEWS_COLLECTION, newView)

        res.status(201).send(insertedView)
      } catch (exception) {
        return next(exception)
      }
    })
}
