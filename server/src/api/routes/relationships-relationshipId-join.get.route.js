/*
  - fetch the joined data for a Relationship
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function (router) {
  router.get('/api/relationships/:relationshipId/join',
    (req, res) => {
      MongoUtil.joinRecords(req.relationship).then((joinedRecords) => {
        res.status(200).send(joinedRecords)
      })
    })
}
