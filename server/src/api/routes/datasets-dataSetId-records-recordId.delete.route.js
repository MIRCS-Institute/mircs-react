/*
  - delete single record from a DataSet
*/

const DataUtil = require('../../utils/data-util.js')

module.exports = function(router) {
  router.delete('/api/datasets/:dataSetId/records/:recordId',
    require('../../middleware/require-sign-in'),
    (req, res, next) => {
      const collectionName = req.dataSet._collectionName

      let db
      DataUtil.getDb()
        .then((theDb) => {
          db = theDb

          const dataSetCollection = db.collection(collectionName)
          const _id = DataUtil.toObjectId(req.params.recordId)
          return dataSetCollection.deleteOne({ _id })
        })
        .then(() => {
          return DataUtil.refreshFields(db, collectionName)
        })
        .then(() => {
          res.status(200).send({ result: 'deleted' })
        })
        .catch(next)
    })
}
