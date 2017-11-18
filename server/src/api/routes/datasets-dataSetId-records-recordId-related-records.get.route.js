/*
  - fetch the related records, as described by the Relationships pertaining to this DataSet
*/

const _ = require('lodash');

module.exports = function(router) {
  router.get('/api/datasets/:dataSetId/records/:recordId/related-records', function(req, res, next) {

    // TODO: replace this placeholder code

    const responseObject = _.extend(req.body, {
      updatedAt: new Date().toISOString()
    });
    res.status(200).send(responseObject);
  });
};