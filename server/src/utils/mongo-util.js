const _ = require('lodash');
const Environment = require(__server_src_dir + 'utils/environment.js');
const log = require(__server_src_dir + 'utils/log.js');
const MongoClient = require('mongodb').MongoClient

const MONGO_SERVER_URL = Environment.getRequired('MONGO_SERVER_URL');

const MongoUtil = {};

//
// Returns a Promise that resolves to a Mongo Db object configured for our database using environment variables.
//
// @see http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html
//
MongoUtil.getDb = function() {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function(error, db) {
      if (error) {
        return reject(error);
      }
      resolve(db);
    });
  });
};

MongoUtil.initialize = function() {
  MongoClient.connect(MONGO_SERVER_URL, function(error, db) {
      if (error) {
        return reject(error);
      }
    db.createCollection("masterCollections", function(err, res) {
      if (err) {
	  throw err;
	  }
        console.log("Collection created!");
        db.close();
      });
    });
};

module.exports = MongoUtil;
