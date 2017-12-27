/*
  - fetch the joined data for a Relationship
*/

const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

module.exports = function (router) {
  router.get('/api/relationships/:relationshipId/join', function (req, res, next) {
    if (!req.relationship) {
      return res.status(404).send({ error: 'No Relationship found with id ' + req.params.relationshipId });
    }
    MongoUtil.joinRecords(req.relationship).then(joinedRecords => {
      res.status(200).send(joinedRecords);
    });
  });
};