const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

/* this route will list the requested collections from the mircsdb 

todo: error handling
*/

module.exports = function (router) {
    const ROUTE_PATH = '/api/read-collection';
    router.get(ROUTE_PATH, function (req, res, next) {
        MongoUtil.getMasterCollection().then(function (collections) {
            // res.status(200).send(collections);
        })
    });
};