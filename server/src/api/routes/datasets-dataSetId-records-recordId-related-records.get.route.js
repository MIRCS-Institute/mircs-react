/*
  - fetch the related records, as described by the Relationships pertaining to this DataSet
*/

module.exports = function(router) {
  router.get('/api/datasets/:dataSetId/records/:recordId/related-records',
    function(req, res) {
      if (!req.dataSet) {
        return res.status(404).send({ error: 'No Data Set found with id ' + req.params.dataSetId })
      }
      if (!req.record) {
        return res.status(404).send({ error: 'No Record found with id ' + req.params.recordId })
      }

      // TODO: implement

      res.status(500).send({ error: 'Unimplemented' })
    })
}
