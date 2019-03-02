/*
  - modifies the contents of DataSet with _id dataSetId
  - request body contains a DataSet object (the _id and _collectionName are optional, if supplied they will be ignored
  - updatedAt field is updated with server time (later updatedBy will be updated with authenticated user id)
  - response body contains the fully populated DataSet object with the updated values
*/

const _ = require('lodash')
const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.put('/api/datasets/:dataSetId',
    require('../../middleware/require-sign-in'),
    function(req, res, next) {
      if (!req.dataSet) {
        return res.status(404).send({ error: 'No Data Set found with id ' + req.params.dataSetId })
      }

      const updatedDataSet = _.clone(req.body)

      // overwrite system fields from existing record
      updatedDataSet._id = req.dataSet._id
      updatedDataSet.createdAt = req.dataSet.createdAt
      updatedDataSet.updatedAt = new Date()
      updatedDataSet._collectionName = req.dataSet._collectionName

      let db
      let dataSetCollection
      MongoUtil.getDb()
        .then((theDb) => {
          db = theDb
          dataSetCollection = db.collection(MongoUtil.DATA_SETS_COLLECTION)

          return dataSetCollection.updateOne({ _id: updatedDataSet._id }, updatedDataSet)
        })
        .then(() => {
          res.status(200).send(updatedDataSet)
        })
        .catch(next)
    })
}
