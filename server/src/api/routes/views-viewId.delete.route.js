const DataUtil = require('../../utils/data-util.js')

module.exports = (router) => {
  router.delete('/api/views/:viewId',
    require('../../middleware/require-sign-in'),
    async (req, res, next) => {
      try {
        await DataUtil.deleteById(DataUtil.VIEWS_COLLECTION, req.params.viewId)
        res.status(200).send({ result: 'deleted' })
      } catch (exception) {
        next(exception)
      }
    })
}
