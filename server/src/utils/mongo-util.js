const _ = require('lodash');
const Environment = require(__server_src_dir + 'utils/environment.js');
const log = require(__server_src_dir + 'utils/log.js');
const MongoClient = require('mongodb').MongoClient
const MONGO_SERVER_URL = Environment.getRequired('MONGO_SERVER_URL');

const mongoose = require('mongoose');
mongoose.connect(MONGO_SERVER_URL);

// import the required models
const DataSet = require("../models/dataSetSchema");

const MongoUtil = {};

/* 
todo: always remember to close the db
*/

/* SERVER METHODs */

/* the initialize function will create the master collection upon starting the server */
MongoUtil.initialize = function () {
  MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
    if (error) {
      return reject(error);
    }
    db.createCollection("datasets", function (err, res) {
      if (err) {
        throw err;
      }
      console.log("The database has been initialized.");
      db.close();
    });
  });
};

/* RELATIONSHIP METHODS */

/* CREATE
createNewRelationship will take in a relationship object
this object represents a number of datasets and their to-be-joined fields
this function will create an entry in the "relationships" collection with their join
 */
MongoUtil.createNewRelationship = function (relationship) {

};

/* READ
readRelationship will take in... */
MongoUtil.readRelationship = function () {

};

/* DATASET METHODS */

/* CREATE
createDataSet will insert an uploaded collection into the database
 */
MongoUtil.createDataSet = function (newDataSet) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
      if (error) {
        return reject(error);
      }
      // save the new dataSet with our mongoose dataSet schema
      const dataSets = new DataSet(newDataSet);
      dataSets.save();
      resolve(newDataSet);
      db.close();
    });
  });
};

/* READ
readDataSet will return a requested collection
 */
MongoUtil.readDataSet = function () {

};

/* UPDATE
updateDataSet will update an existing collection
 */
MongoUtil.updateDataSet = function () {

};

/* DELETE
deleteDataSet will delete a collection
*/
MongoUtil.deleteDataSet = function () {

};

/* MASTER DATASET METHODS */

/* READ
getMasterDataSet will return the entire contents of the master collection 
*/
MongoUtil.getAllDataSets = function () {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
      if (error) {
        return reject(error);
      }
      // send back every single dataset in an array
      const arrayOfDataSets = DataSet.find()
        .then(function (datasets) {
          return datasets;
        });
      resolve(arrayOfDataSets);
      db.close();
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