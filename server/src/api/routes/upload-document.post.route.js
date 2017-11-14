const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

module.exports = function (router) {
    const ROUTE_PATH = '/api/upload-document';

    router.post(ROUTE_PATH, function (req, res, next) {
        const responseObject = _.extend(req.body, {
            updatedAt: new Date().toISOString()
        });
        res.status(200).send(responseObject);
    });
};