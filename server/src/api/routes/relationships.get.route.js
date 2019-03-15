/*
  - fetch list of Relationship objects
*/

const DataUtil = require('../../utils/data-util.js')

module.exports = function(router) {
  router.get('/api/relationships',
    (req, res, next) => {
      DataUtil.find(DataUtil.RELATIONSHIPS_COLLECTION, {})
        .then((dataSets) => {
          res.status(200).send({ list: dataSets })
        }, next)
    })
}
