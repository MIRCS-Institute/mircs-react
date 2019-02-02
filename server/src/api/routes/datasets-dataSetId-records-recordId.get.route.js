/*
  - fetch a single record
*/

module.exports = function(router) {
  router.get('/api/datasets/:dataSetId/records/:recordId', function(req, res) {
    if (!req.dataSet) {
      return res.status(404).send({ error: 'No Data Set found with id ' + req.params.dataSetId })
    }
    if (!req.record) {
      return res.status(404).send({ error: 'No Record found with id ' + req.params.recordId })
    }
    res.status(200).send(req.record)
  })
}
