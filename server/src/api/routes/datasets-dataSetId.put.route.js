/*
  - modifies the contents of DataSet with _id dataSetId
  - request body contains a DataSet object (the _id and _collectionName are optional, if supplied they MUST be exactly what is in the database otherwise the request fails with code 400)
  - updatedAt field is updated with server time (later updatedBy will be updated with authenticated user id)
  - response body contains the fully populated DataSet object with the updated values
*/

const _ = require('lodash');

module.exports = function(router) {
  router.put('/api/datasets/:dataSetId', function(req, res, next) {

    // TODO: replace this placeholder code

    const responseObject = _.extend(req.body, {
      updatedAt: new Date().toISOString()
    });
    res.status(200).send(responseObject);
  });
};