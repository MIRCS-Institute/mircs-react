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
take in a relationship object and return a join of the included datasets
 */
MongoUtil.joinRecords = function (relationship) {
  MongoClient.connect(MONGO_SERVER_URL, function (error, db) {

    // * REMEMBER a relationship can have more than 2 datasets *

    // SAFETY CHECK here to make sure it has all the required properties

    /* ~~~~ it is key that this is made more abstract and general ~~~~~~ */

    // FIX this to use the proper path to a dataset's records
    // FIX make this into a function call and iterate to use for more than two datasets
    let dataSetOne, keyRecords;
    let first = MongoUtil.find(MongoUtil.DATA_SETS_COLLECTION, {
      _collectionName: MongoUtil.DATA_SETS_COLLECTION_PREFIX + relationship.dataSets[0]
    }).then(function (dataSet) {
      dataSetOne = _.clone(dataSet[0]);
    });

    let dataSetTwo;
    let second = MongoUtil.find(MongoUtil.DATA_SETS_COLLECTION, {
      _collectionName: MongoUtil.DATA_SETS_COLLECTION_PREFIX + relationship.dataSets[1]
    }).then(function (dataSet) {
      dataSetTwo = _.clone(dataSet[0]);
    });

    // capture the records of the data sets
    let keyOne = relationship.joinElements[0];
    let keyTwo = relationship.joinElements[1];

    // make this wait for all of the promise iterations
    Promise.all([first, second]).then(function () {
      // FIX make this take in an object, so we can have as many datasets as possible
      let handleJoin = function (dataSetOne, dataSetTwo, keyOne, keyTwo) {
        let dataSetOneRecords = dataSetOne.records;
        let dataSetTwoRecords = dataSetTwo.records;

        let keyOneRecords = [], keyTwoRecords = [];
        let smallestRecord = Math.min(dataSetOneRecords.length, dataSetTwoRecords.length);

        // FIX, how can we copy over the required column (keyOne /keyTwo) on each object
        // without iterating over everything?
        // ... perhaps it can be done using the filters below???
        for (let i = 0; i < smallestRecord; i++) {
          keyOneRecords.push(dataSetOneRecords[i][keyOne]);
          keyTwoRecords.push(dataSetTwoRecords[i][keyTwo]);
        };

        // filter to find the intersections of the keyed columns
        function intersect(keysOne, keysTwo) {
          let t;
          if (keysTwo.length > keysOne.length) t = keysTwo, keysTwo = keysOne, keysOne = t;
          return keysOne
            .filter(function (e) {
              return keysTwo.indexOf(e) > -1;
            })
            .filter(function (e, i, c) {
              return c.indexOf(e) === i;
            });
        }

        // filter the columns of data to find their intersection and return... for now
        let joinedColumns = intersect(keyOneRecords, keyTwoRecords);
        console.log(joinedColumns);
      };

      handleJoin(dataSetOne, dataSetTwo, keyOne, keyTwo);
    });
    db.close();
  });
  return relationship;
};

module.exports = MongoUtil;