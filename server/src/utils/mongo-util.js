const _ = require('lodash');
const Environment = require(__server_src_dir + 'utils/environment.js');
const log = require(__server_src_dir + 'utils/log.js');
const MongoClient = require('mongodb').MongoClient

const MONGO_SERVER_URL = Environment.getRequired('MONGO_SERVER_URL');

const MongoUtil = {};

/* 
Returns a Promise that resolves to a Mongo Db object configured for our database using environment variables.
@see http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html
 */

/* the initialize function will create the master collection */
MongoUtil.initialize = function () {
  MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
    if (error) {
      return reject(error);
    }
    db.createCollection("masterCollections", function (err, res) {
      if (err) {
        throw err;
      }
      console.log("Master Collection created.");
      db.close();
    });
  });
};

/* the getDb function will connect to mongo and return all listed databases */
MongoUtil.getDb = function () {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
      if (error) {
        return reject(error);
      }
      resolve(db);
    });
  });
};

/* the getMasterCollection function will return all uploaded documents in JSON */
/* MongoUtil.getMasterCollection = function () {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
      if (error) {
        return reject(error);
      }
      // what can we access as part of the DB property?
    });
  });
}; */

module.exports = MongoUtil;
