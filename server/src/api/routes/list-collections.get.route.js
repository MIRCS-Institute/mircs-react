const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

/* this route will list all collections in the mircsdb 

todo: error handling
*/

module.exports = function (router) {
    const ROUTE_PATH = '/api/list-collections';
    router.get(ROUTE_PATH, function (req, res, next) {
        MongoUtil.getMasterCollection().then(function (collections) {
            res.status(200).send(collections);
        })
    });
};