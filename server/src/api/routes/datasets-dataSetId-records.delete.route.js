/*
  - delete the entire collection of records
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = (router) => {
  router.delete('/api/datasets/:dataSetId/records',
    require('../../middleware/require-sign-in'),
    (req, res, next) => {
      const collectionName = req.dataSet._collectionName

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
        .then(() => {
          res.status(200).send({ result: 'deleted' })
        })
        .catch(next)
    })
}
