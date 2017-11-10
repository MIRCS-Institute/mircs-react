const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

//
// A sample route that connects to MongoDB and lists the MongoDB databases (not a good idea, but it's a proof of concept).
//
module.exports = function (router) {
    const ROUTE_PATH = '/api/list-databases';

    router.get(ROUTE_PATH, function (req, res, next) {
        MongoUtil.getDb().then(function (db) {
            const adminDb = db.admin();
            return adminDb.listDatabases()
                .then(function (dbs) {

                    res.status(200).send(dbs);

                    _.call(db, 'close');
                })
                .catch(function (error) {
                    // on error close the db and reject the promise
                    // note: if you do not return a rejected Promise the error is treated as a success, which can lead to subtle bugs
                    _.call(db, 'close');
                    return Promise.reject(error);
                });
        })
            .catch(next);
    });
};