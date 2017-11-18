/*
  - creates a new DataSet object in the database
  - request body contains a DataSet object (minus the _id and _collectionName)
  - response body contains the fully populated DataSet object with the _id and _collectionName fields populated
*/

const _ = require('lodash');

module.exports = function(router) {
  router.post('/api/datasets', function(req, res, next) {

    // TODO: replace this placeholder code

    const responseObject = _.extend(req.body, {
      updatedAt: new Date().toISOString()
    });
    res.status(200).send(responseObject);
  });
};