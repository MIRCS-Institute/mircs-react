/*
  - delete a Relationship
*/

const MongoUtil = requireSrc('utils/mongo-util.js');
const ObjectID = require('mongodb').ObjectID;

module.exports = function(router) {
  router.delete('/api/relationships/:relationshipId', function(req, res, next) {
    if (!req.relationship) {
      return res.status(404).send({ error: 'No Relationship found with id ' + req.params.relationshipId });
    }

    let db;
    MongoUtil.getDb()
      .then((theDb) => {
        db = theDb;

        const relationshipsCollection = db.collection(MongoUtil.RELATIONSHIPS_COLLECTION);
        return relationshipsCollection.deleteOne({ _id: ObjectID(req.params.relationshipId) });
      })
      .then(function() {
        res.status(200).send({ result: 'deleted' });
      })
      .catch(next)
      .then(function() {
        db.close();
      });
  });
};