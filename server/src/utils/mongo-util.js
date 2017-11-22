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
createRelationship will take in a relationship object
this object represents a number of datasets and their to-be-joined fields
this function will create an entry in the "relationships" collection with their join
 */
MongoUtil.createRelationship = function (relationship) {
  // pretend that we got a request to see related data of a Person dataset
  // and the requested relationship is House data in halifax
  // the user is doing all of this
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
      let mockRelationship = {
        _id: "321645987",
        name: "PeopleToHousesHalifax",
        description: "Hopefully there will be some results",
        // first one is people, second is houses
        dataSets: ["5a14ad8f04378c60189050dd", "5a14ab9cc9420c5f74adfe33"],
        // the join elements will be the user's request
        // perhaps later we can make it so that each entry in the joinElements
        // array will be another iteration on the MapReduce function, with those values 
        joinElements: [
          ["address", "address"]
        ]
      };

      /* ~~~~ it is key that we make this more abstract and general ~~~~~~ */

      // people_map = function () {
      //   emit(this.records.Address, {
      //     "name": this.records.name,
      //     "city": ""
      //   });
      // }

      // house_map = function () {
      //   emit(this.records.Address, {
      //     "city": this.records.city,
      //     "name": ""
      //   });
      // }

      // r = function (key, values) {
      //   var result = {
      //     "city": "",
      //     "name": ""
      //   };

      //   values.forEach(function (value) {
      //     if (value.city !== null) { result.city = value.city; }
      //     if (value.name !== null) { result.name = value.name; }
      //   });

      //   return result;
      // };

      // var mapFunction1 = function () {
      //   console.log(this.records);
      //   emit(this.records.Name, this.records.Address);
      // };

      // var reduceFunction1 = function (key, values) {
      //   var result = {
      //     "name": "",
      //     "address": ""
      //   };

      //   values.forEach(function (value) {
      //     if (value.name !== null) {
      //       result.name = value.name;
      //     }
      //     if (value.address !== null) {
      //       result.address = value.address;
      //     }
      //   });

      //   return result;
      // };

      // db.collection('datasets').mapReduce(
      //   mapFunction1,
      //   reduceFunction1,
      //   { out: mockRelationship.name }
      // )

      resolve(mockRelationship.name);
      db.close();
    });
  });
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
MongoUtil.readDataSet = function (dataSetId) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
      if (error) {
        return reject(error);
      }
      // send back the requested dataset


      db.close();
    });
  });
};

MongoUtil.readDataSetRecords = function (name) {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_SERVER_URL, function (error, db) {
      if (error) {
        return reject(error);
      }
      // send back the requested dataset
      const query = DataSet.findOne({ 'name': name });

      query.select('records');

      query.exec(function (err, records) {
        if (err) return handleError(err);
      })

      resolve(records);
      db.close();
    });
  });
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