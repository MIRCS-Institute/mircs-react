/*
  - deletes a DataSet and associated records from the database
*/

const _ = require('lodash');

module.exports = function(router) {
  router.delete('/api/datasets/:dataSetId', function(req, res, next) {

    // TODO: replace this placeholder code

    const responseObject = _.extend(req.body, {
      updatedAt: new Date().toISOString()
    });
    res.status(200).send(responseObject);
  });
};