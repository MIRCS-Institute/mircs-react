/*
  - delete the entire collection of records
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.delete('/api/datasets/:dataSetId/records',
    require('../../middleware/require-sign-in'),
    function(req, res, next) {
      if (!req.dataSet) {
        return res.status(404).send({ error: 'No Data Set found with id ' + req.params.dataSetId })
      }

      const collectionName = req.dataSet._collectionName
      if (!collectionName) {
        return res.status(500).send({ error: 'Data Set contains no _collectionName', dataSet: req.dataSet })
      }

      let db
      MongoUtil.getDb()
        .then((theDb) => {
          db = theDb

          const dataSetCollection = db.collection(collectionName)
          return dataSetCollection.deleteMany({})
        })
        .then(() => {
          return MongoUtil.refreshFields(db, collectionName)
        })
        .then(function() {
          res.status(200).send({ result: 'deleted' })
        })
        .catch(next)
        .then(function() {
          db.close()
        })
    })
}
