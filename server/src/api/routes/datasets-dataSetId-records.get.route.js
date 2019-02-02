/*
  - get list of records in a Data Set
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.get('/api/datasets/:dataSetId/records', function(req, res, next) {
    if (!req.dataSet) {
      return res.status(404).send({ error: 'No Data Set found with id ' + req.params.dataSetId })
    }

    const collectionName = req.dataSet._collectionName
    if (!collectionName) {
      return res.status(500).send({ error: 'Data Set contains no _collectionName', dataSet: req.dataSet })
    }

    MongoUtil.find(collectionName, {})
      .then((records) => {
        res.status(200).send({ list: records })
      }, next)
  })
}
