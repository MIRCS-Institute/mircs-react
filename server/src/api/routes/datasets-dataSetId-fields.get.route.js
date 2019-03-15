/*
  - retrieves fields of a Data Set
*/

const DataUtil = require('../../utils/data-util.js')

module.exports = (router) => {
  router.get('/api/datasets/:dataSetId/fields',
    getFields)
}

const getFields = async (req, res, next) => {
  try {
    const collectionName = req.dataSet._collectionName
    const fields = await DataUtil.find(collectionName + DataUtil.DATA_SETS_FIELDS_COLLECTION_SUFFIX, {})
    res.status(200).send({ list: fields })
  } catch(exception) {
    next(exception)
  }
}
