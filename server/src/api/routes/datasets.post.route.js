/*
  - creates a new DataSet object in the database
  - request body contains a DataSet object (minus the _id and _collectionName)
  - response body contains the fully populated DataSet object with the _id and _collectionName fields populated
*/

const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

module.exports = function (router) {
  router.post('/api/datasets', function (req, res, next) {
    MongoUtil.createDataSet(req.body.file).then(function (dataSet) {
      res.status(200).send(dataSet);
    })
  });
};