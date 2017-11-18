/*
  - create a new Relationship
*/

const _ = require('lodash');

module.exports = function(router) {
  router.post('/api/relationships', function(req, res, next) {

    // TODO: replace this placeholder code

    const responseObject = _.extend(req.body, {
      updatedAt: new Date().toISOString()
    });
    res.status(200).send(responseObject);
  });
};