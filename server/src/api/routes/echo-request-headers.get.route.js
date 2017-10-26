//
// A sample route that echoes back to the request headers sent to the server.
//
module.exports = function(router) {
  const ROUTE_PATH = '/api/echo-request-headers';

  router.get(ROUTE_PATH, function(req, res, next) {
    res.status(200).send(req.headers);
  });
};