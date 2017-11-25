/*
When a route defines :relationshipId in its path this param handler will look up and add the Relationship descriptor object
to the Request object as `req.dataSet`.
*/

const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');
const ObjectID = require('mongodb').ObjectID;

module.exports = function(router) {
  router.param('relationshipId', function(req, res, next, relationshipId) {
    try {
      relationshipId = ObjectID(relationshipId);
    } catch (exception) {
      return next(exception);
    }

    MongoUtil.find(MongoUtil.RELATIONSHIPS_COLLECTION, { _id: relationshipId })
      .then((dataSets) => {
        req.relationship = dataSets[0];
        next();
      }, next);
  });
};