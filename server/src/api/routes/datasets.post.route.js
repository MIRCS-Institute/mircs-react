/*
  - creates a new DataSet object in the database
  - request body contains a DataSet object (minus the _id and _collectionName)
  - response body contains the fully populated DataSet object with the _id and _collectionName fields populated
*/

const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

module.exports = function(router) {
  router.post('/api/datasets', function(req, res, next) {
    const newDataSet = _.clone(req.body);
    if (!newDataSet.name) {
      return res.status(400).send('name is required');
    }
    newDataSet.createdAt = newDataSet.updatedAt = new Date();

    let dataSet;
    let dataSetCollection;
    MongoUtil.getCollection(MongoUtil.DATA_SETS_COLLECTION)
      .then((collection) => {
        dataSetCollection = collection;
        return dataSetCollection.insertOne(newDataSet);
      })
      .then((result) => {
        dataSet = result.ops[0];

        dataSet._collectionName = MongoUtil.DATA_SETS_COLLECTION_PREFIX + dataSet._id;

        return dataSetCollection.updateOne({_id:dataSet._id}, dataSet);
      })
      .then(() => {
        return MongoUtil.createCollection(dataSet._collectionName);
      })
      .then(() => {
        res.status(200).send(dataSet);
      })
      .catch(next);
  });
};