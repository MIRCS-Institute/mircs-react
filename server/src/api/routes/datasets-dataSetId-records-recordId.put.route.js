/*
  - update a single record
*/

const _ = require('lodash')
const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.put('/api/datasets/:dataSetId/records/:recordId',
    require('../../middleware/require-sign-in'),
    function(req, res, next) {
      if (!req.dataSet) {
        return res.status(404).send({ error: 'No Data Set found with id ' + req.params.dataSetId })
      }
      if (!req.record) {
        return res.status(404).send({ error: 'No Record found with id ' + req.params.recordId })
      }

      const collectionName = req.dataSet._collectionName
      if (!collectionName) {
        return res.status(500).send({ error: 'Data Set contains no _collectionName', dataSet: req.dataSet })
      }

      const updatedRecord = _.clone(req.body)

      // overwrite system fields from existing record
      updatedRecord._id = req.record._id
      updatedRecord.createdAt = req.record.createdAt
      updatedRecord.updatedAt = new Date()

      let db
      let dataSetCollection
      MongoUtil.getDb()
        .then((theDb) => {
          db = theDb
          dataSetCollection = db.collection(collectionName)

          return dataSetCollection.updateOne({ _id: updatedRecord._id }, updatedRecord)
        })
        .then(() => {
          return MongoUtil.refreshFields(db, collectionName)
        })
        .then(() => {
          res.status(200).send(updatedRecord)
        })
        .catch(next)
        .then(() => {
          db.close()
        })
    })
}
