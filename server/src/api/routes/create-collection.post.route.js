const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

module.exports = function (router) {
    const ROUTE_PATH = '/api/create-collection';
    router.post(ROUTE_PATH, function (req, res, next) {
        MongoUtil.createCollection(req.body.file).then(function () {
            res.status(200).send(req.body.file);
        })
    });
};