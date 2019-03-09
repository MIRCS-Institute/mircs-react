/*
  - get list of records in a Data Set
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = (router) => {
  router.get('/api/datasets/:dataSetId/records',
    (req, res, next) => {
      const collectionName = req.dataSet._collectionName
      MongoUtil.find(collectionName, {})
        .then((records) => {
          res.status(200).send({ list: records })
        }, next)
    })
}
