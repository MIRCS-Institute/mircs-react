const _ = require('lodash');
const Environment = require(__server_src_dir + 'utils/environment.js');
const log = require(__server_src_dir + 'utils/log.js');
const MongoClient = require('mongodb').MongoClient
const MONGO_SERVER_URL = Environment.getRequired('MONGO_SERVER_URL');

const MongoUtil = {};

MongoUtil.DATA_SETS_COLLECTION = 'DataSets';
MongoUtil.DATA_SETS_COLLECTION_PREFIX = 'mircs_';

/*
todo: remember to close the db
*/

/* SERVER METHODs */

/* the initialize function will create the master collection upon starting the server */
MongoUtil.initialize = function () {
  return MongoUtil.createCollection(MongoUtil.DATA_SETS_COLLECTION);
};

/* COLLECTION METHODS */

/* CREATE
createCollection will insert an uploaded collection into the database
 */
MongoUtil.createCollection = function (newCollection) {
  MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
    if (error) {
      return reject(error);
    }
    db.createCollection(newCollection, function (err, res) {
      if (err) {
        throw err;
      }
      db.close();
    });
  });
};

/* READ
readCollection will return a requested collection
 */
MongoUtil.readCollection = function () {

};

/* UPDATE
updateCollection will update an existing collection
 */
MongoUtil.updateCollection = function () {

};

/* DELETE
deleteCollection will delete a collection
*/
MongoUtil.deleteCollection = function () {

};

/* MASTER COLLECTION METHODS */

/* INSERT
insertIntoMasterCollection will insert a collection into the master collection
*/
MongoUtil.insertMasterCollection = function () {

};

/*
Returns a promise that resolves to a named collection
*/
MongoUtil.getCollection = function (collectionName) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
      if (error) { return reject(error); }
      db.collection(collectionName, function (err, collection) {
        if (error) { return reject(error); }
        resolve(collection);
      });
    });
  });
};

module.exports = MongoUtil;



// /*
// the getDb function will connect to Mongo and return a promise to
// a Mongo Db object configured for our database using environment variables.
// @see http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html
// */
// MongoUtil.getDb = function () {
//   return new Promise(function (resolve, reject) {
//     MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
//       if (error) {
//         return reject(error);
//       }
//       resolve(db);
//     });
//   });
// };