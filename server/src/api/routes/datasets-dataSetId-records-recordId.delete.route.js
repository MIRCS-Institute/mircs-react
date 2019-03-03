/*
  - delete single record from a DataSet
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.delete('/api/datasets/:dataSetId/records/:recordId',
    require('../../middleware/require-sign-in'),
    function(req, res, next) {
      if (!req.dataSet) {
        return res.status(404).send({ error: 'No Data Set found with id ' + req.params.dataSetId })
      }
      if (!req.record) {
        return res.status(404).send({ error: 'No Record found with id ' + req.params.dataSetId })
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
          const _id = MongoUtil.toObjectID(req.params.recordId)
          return dataSetCollection.deleteOne({ _id })
        })
        .then(() => {
          return MongoUtil.refreshFields(db, collectionName)
        })
        .then(() => {
          res.status(200).send({ result: 'deleted' })
        })
        .catch(next)
    })
}
