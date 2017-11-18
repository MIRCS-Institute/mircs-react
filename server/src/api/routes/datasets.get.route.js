/*
  - fetches a list of DataSet objects from the database
  - response body contains an array of DataSet objects
  {
    list: [ {DataSet0}, {DataSet1}, etc ]
  }
  - later we'll add a maximum page result configurable by an entry in environment.js's CONFIGURATION_VARS
  - later we'll add filter parameters, for example search by DataSet name/description for type-ahead results
*/

const _ = require('lodash');

module.exports = function(router) {
  router.get('/api/datasets', function(req, res, next) {

    // TODO: replace this placeholder code

    const responseObject = _.extend(req.body, {
      updatedAt: new Date().toISOString()
    });
    res.status(200).send(responseObject);
  });
};