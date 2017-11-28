//
// A sample route that echoes back to the request body sent to the server, plus a time stamp field.
//
const _ = require('lodash');

module.exports = function(router) {
  const ROUTE_PATH = '/api/echo-request-body';

  router.post(ROUTE_PATH, function(req, res, next) {
    const responseObject = _.extend(req.body, {
      updatedAt: new Date().toISOString()
    });
    res.status(200).send(responseObject);
  });
};