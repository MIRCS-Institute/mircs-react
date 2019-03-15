/*
  - modifies the contents of DataSet with _id dataSetId
  - request body contains a DataSet object (the _id and _collectionName are optional, if supplied they will be ignored
  - updatedAt field is updated with server time (later updatedBy will be updated with authenticated user id)
  - response body contains the fully populated DataSet object with the updated values
*/

const _ = require('lodash')
const DataUtil = require('../../utils/data-util.js')

module.exports = function(router) {
  router.put('/api/datasets/:dataSetId',
    require('../../middleware/require-sign-in'),
    updateDataSet)
}

const updateDataSet = async (req, res, next) => {
  try {
    const dataSetId = req.params.dataSetId
    const updatedDataSet = _.extend({}, req.body, {
      // overwrite system fields from existing record
      _id: req.dataSet._id,
      _collectionName: req.dataSet._collectionName,
      createdAt: req.dataSet.createdAt,
      updatedAt: new Date(),
    })


    await DataUtil.updateById(DataUtil.DATA_SETS_COLLECTION, dataSetId, updatedDataSet)
    res.status(200).send(updatedDataSet)
  } catch(exception) {
    next(exception)
  }
}
