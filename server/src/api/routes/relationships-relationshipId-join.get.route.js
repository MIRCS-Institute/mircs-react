/*
  - fetch the joined data for a Relationship
*/

const DataUtil = require('../../utils/data-util.js')

module.exports = function (router) {
  router.get('/api/relationships/:relationshipId/join',
    (req, res) => {
      DataUtil.joinRecords(req.relationship).then((joinedRecords) => {
        res.status(200).send(joinedRecords)
      })
    })
}
