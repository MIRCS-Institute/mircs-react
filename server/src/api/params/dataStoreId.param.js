/*
When a route defines :dataSetId in its path this param handler will look up and add the Data Set descriptor object
to the Request object as `req.dataSet`.
*/

const MongoUtil = requireSrc('utils/mongo-util.js');
const ObjectID = require('mongodb').ObjectID;

module.exports = function(router) {
  router.param('dataSetId', function(req, res, next, dataSetId) {
    try {
      dataSetId = ObjectID(dataSetId);
    } catch (exception) {
      return next(exception);
    }

    MongoUtil.find(MongoUtil.DATA_SETS_COLLECTION, { _id: dataSetId })
      .then((dataSets) => {
        req.dataSet = dataSets[0];
        next();
      }, next);
  });
};