/*
  - create or modify a list of records
  - request body is an array of record objects, if the _id is specified for any records they would be updated
  - updates corresponding DataSet recordsCreatedAt and recordsUpdatedAt as appropriate
*/

const _ = require('lodash');

module.exports = function(router) {
  router.post('/api/datasets/:dataSetId/records', function(req, res, next) {

    // TODO: replace this placeholder code

    const responseObject = _.extend(req.body, {
      updatedAt: new Date().toISOString()
    });
    res.status(200).send(responseObject);
  });
};