const _ = require('lodash');
const Environment = require(__server_src_dir + 'utils/environment.js');
const log = require(__server_src_dir + 'utils/log.js');
const MongoClient = require('mongodb').MongoClient
const MONGO_SERVER_URL = Environment.getRequired('MONGO_SERVER_URL');

const MongoUtil = {};

/* 
todo: remember to close the db
*/

/* SERVER METHODs */

/* the initialize function will create the master collection upon starting the server */
MongoUtil.initialize = function () {
  MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
    if (error) {
      return reject(error);
    }
    db.createCollection("masterCollection", function (err, res) {
      if (err) {
        throw err;
      }
      console.log("master collection created...");
      db.close();
    });
  });
};

/* COLLECTION METHODS */

/* CREATE
createCollection will insert an uploaded collection into the database
 */
MongoUtil.createCollection = function (newCollection) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
      if (error) {
        return reject(error);
      }
      // convert the contents of the master collection to an array and resolve the promise
      db.collection('masterCollection', function (err, masterCollection) {
        console.log(newCollection);
        // masterCollection.insertOne({ _id: 10, item: "brayyyyy", qty: 20 });
        masterCollection.insertOne(newCollection);
        resolve(masterCollection);
      });
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

/* READ
getMasterCollection will return the entire contents of the master collection 
*/
MongoUtil.getMasterCollection = function () {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
      if (error) {
        return reject(error);
      }
      // convert the contents of the master collection to an array and resolve the promise
      db.collection('masterCollection', function (err, masterCollection) {
        masterCollection.find().toArray(function (err, collections) {
          if (err) throw err;
          resolve(collections);
        });
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