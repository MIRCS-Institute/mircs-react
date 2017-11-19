/*
  - retrieves statistics about Data Set records
*/

const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

module.exports = function(router) {
  router.get('/api/datasets/:dataSetId/stats', function(req, res, next) {
    if (!req.dataSet) {
      return res.status(404).send({ error: 'No Data Set found with id ' + req.params.dataSetId });
    }

    const collectionName = req.dataSet._collectionName;
    if (!collectionName) {
      return res.status(500).send({ error: 'Data Set contains no _collectionName', dataSet: req.dataSet });
    }

    let db;
    MongoUtil.getDb()
      .then((theDb) => {
        db = theDb;
        return db.collection(collectionName).stats();
      })
      .then((collectionStats) => {
        // return the subset of the fields returned by MongoDB stats that are of interest to clients
        const result = _.pick(collectionStats, [
          'size', 'count', 'storageSize',
        ]);

        res.status(200).send(result);
      })
      .catch(next)
      .then(() => {
        db.close();
      });

  });
};