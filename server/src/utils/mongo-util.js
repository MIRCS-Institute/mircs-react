const _ = require('lodash');
const Environment = require(__server_src_dir + 'utils/environment.js');
const log = require(__server_src_dir + 'utils/log.js');
const MongoClient = require('mongodb').MongoClient

const MONGO_SERVER_URL = Environment.getRequired('MONGO_SERVER_URL');

const MongoUtil = {};

MongoUtil.DATA_SETS_COLLECTION = 'DataSets';
MongoUtil.RELATIONSHIPS_COLLECTION = 'Relationships';
MongoUtil.DATA_SETS_COLLECTION_PREFIX = 'dataset_';
MongoUtil.DATA_SETS_FIELDS_COLLECTION_SUFFIX = '_fields';

/* the initialize function will create the master collection upon starting the server */
MongoUtil.initialize = function () {
  return MongoUtil.createCollection(MongoUtil.DATA_SETS_COLLECTION)
    .then(() => {
      return MongoUtil.createCollection(MongoUtil.RELATIONSHIPS_COLLECTION);
    });
};

MongoUtil.validateRelationship = function (relationship) {
  if (!_.isString(relationship.name)) {
    throw new Error('name is required');
  }
  if (!_.isArray(relationship.dataSets)) {
    throw new Error('dataSets array is required');
  }
  if (!_.isArray(relationship.joinElements)) {
    throw new Error('joinElements array is required');
  }
  _.each(relationship.joinElements, function (joinElement) {
    if (relationship.dataSets.length !== joinElement.length) {
      throw new Error('joinElements arrays must be the same length as dataSets');
    }
  });
};

/*
Connects to MongoDB and returns a promise that resolves to a Database object connected to
our database.

Configuration is gathered from the environment.js module.

Note: the returned db instance should be closed when finished.

@see http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html
*/
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

/*
creates a new collection in the database
@see http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#createCollection
 */
MongoUtil.createCollection = function (collectionName, options) {
  return MongoUtil.getDb().then(function (db) {
    return db.createCollection(collectionName, options, function (error, res) {
      db.close();
      if (error) {
        throw error;
      }
    });
  });
};

/*
finds and returns documents in a collection matching the passed query
@see http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#find
*/
MongoUtil.find = function (collectionName, query) {
  let db;
  return MongoUtil.getDb()
    .then(function (theDb) {
      db = theDb;

      return new Promise(function (resolve, reject) {
        db.collection(collectionName)
          .find(query)
          .toArray(function (error, result) {
            db.close();
            if (error) {
              return reject(error);
            }
            return resolve(result);
          });
      });
    });
};

/*
update the fields collection associated with a collection
*/
MongoUtil.refreshFields = function (db, collectionName) {
  return db.collection(collectionName).mapReduce(
    function map() {
      for (var key in this) {
        emit(key, typeof this[key]);
      }
    },
    function reduce(key, vals) {
      return vals[0];
    }, {
      out: collectionName + MongoUtil.DATA_SETS_FIELDS_COLLECTION_SUFFIX
    });
};

/* 
take in a relationship object and return a relationship object 
with a newly added record containing the requested join
 */
MongoUtil.joinRecords = function (relationship) {
  // the master promise
  return new Promise((resolve, reject) => {
    collectDataSets() // grab the dataSet records from the database
      .then(arrayOfDataSets => {
        handleJoin(arrayOfDataSets) // find matching tuples and merge them, return as a new set of records
          .then(joinedRecords => {
            return resolve(joinedRecords);
          })
          .catch((e) => {
            console.log(e); // remove later
          });
      })
      .catch((e) => {
        console.log(e); // remove later
      });
  });

  // return an array of datasets
  function collectDataSets() {
    return new Promise((resolve, reject) => {

      // find a collection by name and return it
      function findDataSets(_collectionName) {
        return new Promise((resolve, reject) => {
          MongoUtil.find(MongoUtil.DATA_SETS_COLLECTION, { "_collectionName": _collectionName })
            .then(dataSet => {
              resolve(dataSet);
            });
        })
      }
      /* 
      create a chain of promises using the findDataSets function to 
      find every listed dataSet and return these dataSets in an array
      ... this is to account for an arbitrary number of dataSets
      */
      function returnDataSets() {
        let dataSetList = _.clone(relationship.dataSets);
        let dataSetPromiseChain = [];

        for (let i = 0; i < dataSetList.length; i++) {
          let _collectionName = MongoUtil.DATA_SETS_COLLECTION_PREFIX + "" + relationship.dataSets[i];
          dataSetPromiseChain.push(findDataSets(_collectionName)); // find dataset and add to chain
        };

        return Promise.all(dataSetPromiseChain)
          .then((fullDataSetChain) => {
            return resolve(fullDataSetChain);
          })
          .catch((e) => {
            console.log(e); // remove later
          });
      }

      // once all dataSets have been found, return the array
      returnDataSets().then(arrayOfDataSets => {
        return resolve(arrayOfDataSets);
      });
    });
  }

  // join the columns of the datasets determined by the key parameters
  function handleJoin(arrayOfDataSets) {
    return new Promise((resolve, reject) => {

      // find the smallest column of data
      let smallestRecord = arrayOfDataSets[0][0].records.length;
      for (let i = 1; i < arrayOfDataSets.length; i++) {
        if ((arrayOfDataSets[i][0].records.length) < smallestRecord) {
          smallestRecord = arrayOfDataSets[i][0].records.length;
        }
      }

      /* 
      ALERT 
      this is where implementation for more than 2 datasets stops... for now... my noggin hurts
      from here it will only work with 2 dataSets 
      */

      // FIX this to use the proper path to a dataset's records
      // I've manually added the records array to both objects in the DB
      let dataSetOneRecords = arrayOfDataSets[0][0].records;
      let dataSetTwoRecords = arrayOfDataSets[1][0].records;
      let keyOne = relationship.joinElements[0]; // assuming we'll only be using two keys... perhaps this will change
      let keyTwo = relationship.joinElements[1];
      /* 
      FIX, not efficient
      how can we copy over the required column (keyOne /keyTwo) on each object
      without iterating over everything? perhaps using the filters in the columnIntersection function? 
      */
      let keyOneRecords = [], keyTwoRecords = [];
      for (let i = 0; i < smallestRecord; i++) {
        keyOneRecords.push(dataSetOneRecords[i][keyOne]);
        keyTwoRecords.push(dataSetTwoRecords[i][keyTwo]);
      };

      // filter to find the intersections of the keyed columns
      // TODO make it so that the filter will "soft" match strings that are slightly similar
      function columnIntersection(colOne, colTwo) {
        let temp;
        let joinedRows = [];
        if (colTwo.length > colOne.length) {
          temp = colTwo, colTwo = colOne, colOne = temp;
        }
        colOne.filter(function (current) {
          if (colTwo.indexOf(current) > -1) { // then we have a matching column
            let dataSetOneRecordRow = dataSetOneRecords[colTwo.indexOf(current)];
            let dataSetTwoRecordRow = dataSetTwoRecords[colTwo.indexOf(current)];
            // now join the matching data
            joinedRows.push(_.merge(dataSetOneRecordRow, dataSetTwoRecordRow));
          }
        })
        return joinedRows; // return the array of joined rows
      }
      // clone the relationship object and return a copy with the joined rows
      let joinedRecords = _.clone(relationship);
      joinedRecords.records = _.clone(columnIntersection(keyOneRecords, keyTwoRecords));
      return resolve(joinedRecords); // remember to reject too
    });
  };
};

module.exports = MongoUtil;