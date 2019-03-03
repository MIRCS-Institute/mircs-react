/*
  - deletes a DataSet and associated records from the database
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.delete('/api/datasets/:dataSetId',
    require('../../middleware/require-sign-in'),
    function(req, res, next) {
      if (!req.dataSet) {
        return res.status(404).send({ error: 'No Data Set found with id ' + req.params.dataSetId })
      }

      let db
      MongoUtil.getDb()
        .then((theDb) => {
          db = theDb

          // delete the associated records collection
          const collectionName = req.dataSet._collectionName
          if (collectionName) {
            return db.collection(collectionName).drop().catch(function(error) {
              // best effort here, do not fail the entire operation if the collection cannot be deleted
              console.error('Ignoring error deleting collection for Data Set', req.dataSet, error)
            })
          }
        })
        .then(function() {
          const dataSetCollection = db.collection(MongoUtil.DATA_SETS_COLLECTION)
          const _id = MongoUtil.toObjectID(req.params.dataSetId)
          return dataSetCollection.deleteOne({ _id })
        })
        .then(function() {
          res.status(200).send({ result: 'deleted' })
        })
        .catch(next)
    })
}
