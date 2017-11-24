/*
  - deletes a DataSet and associated records from the database
*/

const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');
const ObjectID = require('mongodb').ObjectID;

module.exports = function (router) {
    router.delete('/api/datasets/:dataSetId', function (req, res, next) {
        if (!req.dataSet) {
            return res.status(404).send({error: 'No Data Set found with id ' + req.params.dataSetId});
        }

        let db;
        MongoUtil.getDb()
            .then((theDb) => {
                db = theDb;

                // delete the associated records collection
                const collectionName = req.dataSet._collectionName;
                if (collectionName) {
                    return db.collection(collectionName).drop().catch(function (error) {
                        // best effort here, do not fail the entire operation if the collection cannot be deleted
                        console.error('Ignoring error deleting collection for Data Set', req.dataSet, error);
                    });
                }
            })
            .then(function () {
                dataSetCollection = db.collection(MongoUtil.DATA_SETS_COLLECTION)
                return dataSetCollection.deleteOne({_id: ObjectID(req.params.dataSetId)});
            })
            .then(function () {
                res.status(200).send({result: 'deleted'});
            })
            .catch(next)
            .then(function () {
                db.close();
            });
    });
};