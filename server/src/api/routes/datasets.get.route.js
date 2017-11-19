/*
  - fetches a list of DataSet objects from the database
  - response body contains an array of DataSet objects
  {
    list: [ {DataSet0}, {DataSet1}, etc ]
  }
  - later we'll add a maximum page result configurable by an entry in environment.js's CONFIGURATION_VARS
  - later we'll add filter parameters, for example search by DataSet name/description for type-ahead results
*/

const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

module.exports = function(router) {
  router.get('/api/datasets', function(req, res, next) {
    MongoUtil.find(MongoUtil.DATA_SETS_COLLECTION, {})
      .then((dataSets) => {
        res.status(200).send({ list: dataSets });
      }, next);
  });
};