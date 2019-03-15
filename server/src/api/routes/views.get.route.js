const DataUtil = require('../../utils/data-util.js')

module.exports = function(router) {
  router.get('/api/views',
    async (req, res, next) => {
      try {
        const list = await DataUtil.find(DataUtil.VIEWS_COLLECTION, {})
        res.status(200).send({ list })
      } catch (exception) {
        next(exception)
      }
    })
}
