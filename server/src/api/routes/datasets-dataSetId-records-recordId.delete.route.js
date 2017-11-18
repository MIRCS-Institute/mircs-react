/*
  - delete single record from a DataSet
*/

const _ = require('lodash');

module.exports = function(router) {
  router.delete('/api/datasets/:dataSetId/records/:recordId', function(req, res, next) {

    // TODO: replace this placeholder code

    const responseObject = _.extend(req.body, {
      updatedAt: new Date().toISOString()
    });
    res.status(200).send(responseObject);
  });
};