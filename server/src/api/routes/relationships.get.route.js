/*
  - fetch list of Relationship objects
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.get('/api/relationships',
    function(req, res, next) {
      MongoUtil.find(MongoUtil.RELATIONSHIPS_COLLECTION, {})
        .then((dataSets) => {
          res.status(200).send({ list: dataSets })
        }, next)
    })
}
