const _ = require('lodash')
const DataUtil = require('../../utils/data-util.js')

module.exports = (router) => router.get('/api/datasets/:dataSetId/stats',
  getDataSetStats)

async function getDataSetStats(req, res, next) {
  try {
    const collectionName = req.dataSet._collectionName

    const db = await DataUtil.getDb()
    const collectionStats = await db.collection(collectionName).stats()
    // return the subset of the fields returned by MongoDB stats that are of interest to clients
    const result = _.pick(collectionStats, [
      'size',
      'count',
      'avgObjSize',
      'storageSize',
      'nindexes',
      'totalIndexSize',
      'capped',
    ])

    res.status(200).send(result)
  } catch (exception) {
    next(exception)
  }
}
