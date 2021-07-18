/*
  - update a single record
*/

const _ = require('lodash')
const DataUtil = require('../../utils/data-util.js')

module.exports = function(router) {
  router.put('/api/datasets/:dataSetId/records/:recordId',
    require('../../middleware/require-sign-in'),
    (req, res, next) => {
      const collectionName = req.dataSet._collectionName

      const updatedRecord = _.clone(req.body)

      // overwrite system fields from existing record
      updatedRecord._id = req.record._id
      updatedRecord.createdAt = req.record.createdAt
      updatedRecord.updatedAt = new Date()

      let db
      DataUtil.getDb()
        .then((theDb) => {
          db = theDb

          return DataUtil.updateById(collectionName, updatedRecord._id, updatedRecord)
        })
        .then(() => {
          return DataUtil.refreshFields(db, collectionName)
        })
        .then(() => {
          res.status(200).send(updatedRecord)
        })
        .catch(next)
    })
}
