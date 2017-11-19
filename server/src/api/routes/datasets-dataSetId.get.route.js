/*
  - fetches identified DataSet object
  - response body contains the DataSet object from the database
*/

module.exports = function(router) {
  router.get('/api/datasets/:dataSetId', function(req, res, next) {
    if (!req.dataSet) {
      return res.status(404).send({ error: 'No Data Set found with id ' + req.params.dataSetId });
    }
    res.status(200).send(req.dataSet);
  });
};