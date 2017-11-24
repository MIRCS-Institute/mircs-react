/*
  - retrieves fields of a Data Set
*/

const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

module.exports = function (router) {
    router.get('/api/datasets/:dataSetId/fields', function (req, res, next) {
        if (!req.dataSet) {
            return res.status(404).send({error: 'No Data Set found with id ' + req.params.dataSetId});
        }

        const collectionName = req.dataSet._collectionName;
        if (!collectionName) {
            return res.status(500).send({error: 'Data Set contains no _collectionName', dataSet: req.dataSet});
        }

        MongoUtil.find(collectionName + MongoUtil.DATA_SETS_FIELDS_COLLECTION_SUFFIX, {})
            .then((fields) => {
                res.status(200).send({fields: fields});
            }, next);
    });
};