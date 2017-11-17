const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');
const mongoose = require('mongoose');

/* this route will list all collections in the mircsdb 

todo: error handling
*/

// const collectionSchema = new Schema({
//     name: {
//         type: String,
//         required: true
//     }
// });

// const Collection = mongoose.model('Collection', collectionSchema);

module.exports = function (router) {
    const ROUTE_PATH = '/api/read-all-collections';
    router.get(ROUTE_PATH, function (req, res, next) {
        MongoUtil.getMasterCollection().then(function (collections) {
                res.status(200).send(collections);
        })
    });
};