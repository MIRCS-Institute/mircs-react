/*
  - create or modify a list of records
  - request body is an array of record objects, if the _id is specified for any records they would be updated
  - updates corresponding DataSet recordsCreatedAt and recordsUpdatedAt as appropriate
*/

const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

module.exports = function (router) {
    router.post('/api/datasets/:dataSetId/records', function (req, res, next) {
        if (!req.dataSet) {
            return res.status(404).send({error: 'No Data Set found with id ' + req.params.dataSetId});
        }

        const collectionName = req.dataSet._collectionName;
        if (!collectionName) {
            return res.status(500).send({error: 'Data Set contains no _collectionName', dataSet: req.dataSet});
        }

        let db;
        let responseJson;
        MongoUtil.getDb()
            .then((theDb) => {
                db = theDb;

                return db.collection(collectionName).insertMany(req.body)
                    .then((result) => {
                        responseJson = _.pick(result, ['insertedCount', 'insertedIds']);
                    });
            })
            .then(() => {
                return MongoUtil.refreshFields(db, collectionName);
            })
            .then(() => {
                res.status(201).send(responseJson);
            })
            .catch(next)
            .then(() => {
                db.close();
            });
    });
};