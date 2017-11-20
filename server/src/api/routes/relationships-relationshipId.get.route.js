/*
  - fetch an identified Relationship object
*/

module.exports = function(router) {
  router.get('/api/relationships/:relationshipId', function(req, res, next) {

    // TODO: implement

    res.status(500).send({ error: 'Unimplemented' });
  });
};