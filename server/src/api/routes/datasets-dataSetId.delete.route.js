/*
  - deletes a DataSet and associated records from the database
*/

const DataUtil = require('../../utils/data-util.js')

module.exports = function(router) {
  router.delete('/api/datasets/:dataSetId',
    require('../../middleware/require-sign-in'),
    deleteDataSet)
}

const deleteDataSet = async (req, res, next) => {
  try {
    const db = await DataUtil.getDb()

    // delete the associated records collection
    const collectionName = req.dataSet._collectionName
    // best effort here, do not fail the entire operation if the collection cannot be deleted
    db.collection(collectionName).drop().catch((error) => {
      console.error('Ignoring error deleting collection for Data Set', req.dataSet, error)
    })
    // best effort to drop fields collection
    db.collection(collectionName + DataUtil.DATA_SETS_FIELDS_COLLECTION_SUFFIX).drop().catch((error) => {
      console.error('Ignoring error deleting fields for Data Set', req.dataSet, error)
    })

    await DataUtil.deleteById(DataUtil.DATA_SETS_COLLECTION, req.params.dataSetId)
    res.status(200).send({ result: 'deleted' })
  } catch(exception) {
    next(exception)
  }
}
