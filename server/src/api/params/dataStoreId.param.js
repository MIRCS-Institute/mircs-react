/*
When a route defines :dataSetId in its path this param handler will look up and add the Data Set descriptor object
to the Request object as `req.dataSet`.
*/

const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');
const ObjectID = require('mongodb').ObjectID

module.exports = function(router) {
  router.param('dataSetId', function(req, res, next, dataSetId) {
    try {
      dataSetId = ObjectID(dataSetId);
    } catch (exception) {
      return next(exception);
    }

    const query = { _id: dataSetId };
    MongoUtil.find(MongoUtil.DATA_SETS_COLLECTION, query)
      .then((dataSets) => {
        req.dataSet = dataSets[0];
        next();
      }, next);
  });
};