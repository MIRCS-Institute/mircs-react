/*
  - fetch an identified Relationship object
*/

module.exports = function (router) {
  router.get('/api/relationships/:relationshipId', function (req, res, next) {
    if (!req.relationship) {
      return res.status(404).send({ error: 'No Relationship found with id ' + req.params.relationshipId });
    }
    res.status(200).send(req.relationship);
  });
};