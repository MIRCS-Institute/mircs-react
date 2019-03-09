/*
  - retrieves fields of a Data Set
*/

const MongoUtil = require('../../utils/mongo-util.js')

module.exports = (router) => {
  router.get('/api/datasets/:dataSetId/fields',
    (req, res, next) => {
      const collectionName = req.dataSet._collectionName
      MongoUtil.find(collectionName + MongoUtil.DATA_SETS_FIELDS_COLLECTION_SUFFIX, {})
        .then((fields) => {
          res.status(200).send({ list: fields })
        }, next)
    })
}
