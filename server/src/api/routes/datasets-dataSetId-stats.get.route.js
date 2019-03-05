/*
  - retrieves statistics about Data Set records
*/

const _ = require('lodash')
const MongoUtil = require('../../utils/mongo-util.js')

module.exports = (router) => {
  router.get('/api/datasets/:dataSetId/stats',
    (req, res, next) => {
      const collectionName = req.dataSet._collectionName

      let db
      MongoUtil.getDb()
        .then((theDb) => {
          db = theDb
          return db.collection(collectionName).stats()
        })
        .then((collectionStats) => {
          // return the subset of the fields returned by MongoDB stats that are of interest to clients
          const result = _.pick(collectionStats, [
            'size', 'count', 'storageSize',
          ])

          res.status(200).send(result)
        })
        .catch(next)
    })
}
