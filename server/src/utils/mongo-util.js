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
MongoUtil.initialize = function() {
  return MongoUtil.createCollection(MongoUtil.DATA_SETS_COLLECTION)
    .then(() => {
      return MongoUtil.createCollection(MongoUtil.RELATIONSHIPS_COLLECTION);
    });
};

MongoUtil.validateRelationship = function(relationship) {
  if (!_.isString(relationship.name)) {
    throw new Error('name is required');
  }
  if (!_.isArray(relationship.dataSets)) {
    throw new Error('dataSets array is required');
  }
  if (!_.isArray(relationship.joinElements)) {
    throw new Error('joinElements array is required');
  }
  _.each(relationship.joinElements, function(joinElement) {
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

/*
creates a new collection in the database
@see http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#createCollection
 */
MongoUtil.createCollection = function(collectionName, options) {
  return MongoUtil.getDb().then(function(db) {
    return db.createCollection(collectionName, options, function(error, res) {
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
MongoUtil.find = function(collectionName, query) {
  let db;
  return MongoUtil.getDb()
    .then(function(theDb) {
      db = theDb;

      return new Promise(function(resolve, reject) {
        db.collection(collectionName)
          .find(query)
          .toArray(function(error, result) {
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
MongoUtil.refreshFields = function(db, collectionName) {
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
  // console.log(relationship);
  return new Promise((resolve, reject) => {
    collectDataSets() // grab the dataSet records from the database
      .then(arrayOfDataSets => {
        // console.log(arrayOfDataSets);
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
          // look in the db and return the dataSet
          MongoUtil.find(_collectionName)
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
      let smallestRecordLength = arrayOfDataSets[0].length;
      for (let i = 1; i < arrayOfDataSets.length; i++) {
        if ((arrayOfDataSets[i].length) < smallestRecordLength) {
          smallestRecordLength = arrayOfDataSets[i].length;
        }
      }

      // initialize 2D arrays for the the dataSetRecords
      let firstKeyColumn = new Array();
      let secondKeyColumn = new Array();
      for (let i = 0; i < relationship.joinElements.length; i++) {
        let arr = new Array();
        let arr1 = new Array();
        firstKeyColumn.push(arr);
        secondKeyColumn.push(arr1);
      }

      /* 
      loop through each record to find the required column, by key,
      and add that to the key array. we do this for each requested 
      join in the joinElements array 
      */
      for (let i = 0; i < relationship.joinElements.length; i++) {
        for (let j = 0; j < smallestRecordLength; j++) {
          // when i increments we need to make a new array because that's a new column / field
          firstKeyColumn[i].push(arrayOfDataSets[0][j][relationship.joinElements[i][0]]);
          secondKeyColumn[i].push(arrayOfDataSets[1][j][relationship.joinElements[i][1]]);
        }
      }

      /* 
      take in two 2D arrays that contain the columns of data which will be compared
      and return an array of objects that have been merged

      Caveats:
      -for reasons not yet known, when selecting datapoints/field to compare on the application,
      it is required that 'Address_Number' is added first, then 'Street' second
      */
      function columnIntersection(colOne, colTwo) {
        let joinedRows = [], temp, completeFieldMatch;
        /* 
        first, we find determine which column is longest and filter on that
        */
        if (colTwo[0].length > colOne[0].length) {
          temp = colTwo[0], colTwo[0] = colOne[0], colOne[0] = temp;
        }
        /* 
        we iterate over every string in the colOne array and then check it
        is anywhere in the colTwo array
        */
        colOne[0].filter(current => {
          if (colTwo[0].indexOf(current) > -1) {
            /*  
            if there is an index for the given string somewhere in the colTwo array
            then we iterate over the remaining fields to check if the rest of them match
            */
            if (colOne.length > 1) { // more than one field to compare
              for (let k = 1; k < colOne.length; k++) {
                completeFieldMatch = false;
                colOne[k].filter(nextCurrent => {
                  /* 
                  each iteration we set completeFieldMatch to false
                  */
                  if (colTwo[k].indexOf(nextCurrent) > -1) {
                    completeFieldMatch = true;
                  }
                })
              }
            } else { // if there was only one field to compare
              completeFieldMatch = true;
            }
            /* 
            if we leave the loop and completeFieldMatch is true, then we know that we 
            compared every field and merge both respective dataset rows
            */
            if (completeFieldMatch) {
              joinedRows.push(
                _.merge(
                  arrayOfDataSets[0][colOne[0].indexOf(current)],
                  arrayOfDataSets[1][colTwo[0].indexOf(current)])
              );
            }
          }
        })
        return joinedRows; // return the array of joined rows
      }
      // clone the relationship object and return a copy with the joined rows
      let joinedRecords = _.clone(relationship);
      joinedRecords.records = _.clone(columnIntersection(firstKeyColumn, secondKeyColumn));
      return resolve(joinedRecords); // remember to reject too
    });
  };
};


module.exports = MongoUtil;