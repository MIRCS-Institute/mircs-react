/*
  - create or modify a list of records
  - request body is an array of record objects, if the _id is specified for any records they would be updated
  - updates corresponding DataSet recordsCreatedAt and recordsUpdatedAt as appropriate
*/

const _ = require('lodash')
const DataUtil = require('../../utils/data-util.js')

module.exports = (router) => {
  router.post('/api/datasets/:dataSetId/records',
    require('../../middleware/require-sign-in'),
    (req, res, next) => {
      const collectionName = req.dataSet._collectionName

      const newRecords = req.body.records
      if (!_.get(newRecords, 'length')) {
        return res.status(400).send('no records in upload')
      }

      const now = new Date()
      const errors = []
      _.each(newRecords, (newRecord, index) => {
        if (!_.isUndefined(newRecord._createdAt)) {
          return errors.push(`record at ${index} has _createdAt specified`)
        }
        if (!_.isUndefined(newRecord._updatedAt)) {
          return errors.push(`record at ${index} has _updatedAt specified`)
        }

        newRecord._createdAt = newRecord._updatedAt = now
      })
      if (errors.length) {
        return res.status(400).send(errors.join(', '))
      }

      let db
      let responseJson
      DataUtil.getDb()
        .then((theDb) => {
          db = theDb

          return db.collection(collectionName).insertMany(newRecords)
            .then((result) => {
              responseJson = _.pick(result, ['insertedCount', 'insertedIds'])
            })
        })
        .then(() => {
          return DataUtil.refreshFields(db, collectionName)
        })
        .then(() => {
          res.status(201).send(responseJson)
        })
        .catch(next)
    })
}
