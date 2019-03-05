/*
  - fetch a single record
*/

module.exports = (router) => {
  router.get('/api/datasets/:dataSetId/records/:recordId',
    (req, res) => {
      res.status(200).send(req.record)
    })
}
