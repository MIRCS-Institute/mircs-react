/*
  - fetch an identified Relationship object
*/

const _ = require('lodash');

module.exports = function(router) {
  router.get('/api/relationships/:relationshipId', function(req, res, next) {

    // TODO: replace this placeholder code

    const responseObject = _.extend(req.body, {
      updatedAt: new Date().toISOString()
    });
    res.status(200).send(responseObject);
  });
};