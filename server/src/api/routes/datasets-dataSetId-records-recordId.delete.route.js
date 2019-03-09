/*
  - delete single record from a DataSet
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.delete('/api/datasets/:dataSetId/records/:recordId',
    require('../../middleware/require-sign-in'),
    (req, res, next) => {
      const collectionName = req.dataSet._collectionName

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
