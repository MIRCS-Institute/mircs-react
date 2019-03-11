/*
  - fetches a list of DataSet objects from the database
  - response body contains an array of DataSet objects
  {
    list: [ {DataSet0}, {DataSet1}, etc ]
  }
  - later we'll add a maximum page result configurable by an entry in environment.js's CONFIGURATION_VARS
  - later we'll add filter parameters, for example search by DataSet name/description for type-ahead results
*/

const DataUtil = require('../../utils/data-util.js')

module.exports = function(router) {
  router.get('/api/datasets', getDataSets)
}

const getDataSets = async (req, res, next) => {
  try {
    const dataSets = await DataUtil.find(DataUtil.DATA_SETS_COLLECTION, {})
    res.status(200).send({ list: dataSets })
  } catch (exception) {
    next(exception)
  }
}
