/*
  - fetches identified DataSet object
  - response body contains the DataSet object from the database
*/

module.exports = function(router) {
  router.get('/api/datasets/:dataSetId',
    (req, res) => {
      res.status(200).send(req.dataSet)
    })
}
