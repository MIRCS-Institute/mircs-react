/*
  - delete the entire collection of records
*/

const DataUtil = require('../../utils/data-util.js')

module.exports = (router) => {
  router.delete('/api/datasets/:dataSetId/records',
    require('../../middleware/require-sign-in'),
    (req, res, next) => {
      const collectionName = req.dataSet._collectionName

      let db
      DataUtil.getDb()
        .then((theDb) => {
          db = theDb

          const dataSetCollection = db.collection(collectionName)
          return dataSetCollection.deleteMany({})
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
