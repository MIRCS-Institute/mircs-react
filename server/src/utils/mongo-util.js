const _ = require('lodash');
const Environment = requireSrc('utils/environment.js');
const log = requireSrc('utils/log.js');
const MongoClient = require('mongodb').MongoClient

const MONGO_SERVER_URL = Environment.getRequired('MONGO_SERVER_URL');

const MongoUtil = {};

MongoUtil.DATA_SETS_COLLECTION = 'DataSets';
MongoUtil.RELATIONSHIPS_COLLECTION = 'Relationships';
MongoUtil.DATA_SETS_COLLECTION_PREFIX = 'dataset_';
MongoUtil.DATA_SETS_FIELDS_COLLECTION_SUFFIX = '_fields';

/* the initialize function will create the master collection upon starting the server */
MongoUtil.initialize = function () {
  return MongoUtil
    .createCollection(MongoUtil.DATA_SETS_COLLECTION)
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
    MongoClient
      .connect(MONGO_SERVER_URL, function (error, db) {
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
  return MongoUtil
    .getDb()
    .then(function (db) {
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
  return MongoUtil
    .getDb()
    .then(function (theDb) {
      db = theDb;

      return new Promise(function (resolve, reject) {
        db
          .collection(collectionName)
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

  return new Promise(function(resolve, reject) {
    const cursor = db.collection(collectionName).find();
    const fields = {};
    cursor.each(function(err, item) {
      if (err) {
        return reject(err);
      }

      if (item === null) {
        // cursor is exhausted
        return resolve(fields);
      }

      _.each(item, function(value, key) {
        fields[key] = typeof this[key];
      });
    });
  })
  .then(function(fields) {
    const fieldsCollection = db.collection(collectionName + MongoUtil.DATA_SETS_FIELDS_COLLECTION_SUFFIX)
    return fieldsCollection.remove({})
      .then(function() {
        fieldDocs = [];
        _.each(fields, function(value, key) {
          fieldDocs.push({ _id: key, value: value })
        });
        return fieldsCollection.insertMany(fieldDocs);
      });
  });
};

/*
from a relationship object fetch the set of joined records
 */
MongoUtil.joinRecords = function(relationship) {
  if (_.get(relationship, 'dataSets.length') !== 2) {
    return Promise.reject(new Error('currently limited to relationships with 2 data sets'));
  }

  return collectDataSets() // grab the dataSet records from the database
    .then(handleJoin); // find matching tuples and merge them, return as a new set of records

  // return a promise resolving to an array of arrays of dataset records
  function collectDataSets() {
    const promises = [];
    _.each(relationship.dataSets, function(dataSetId) {
      const collectionName = MongoUtil.DATA_SETS_COLLECTION_PREFIX + dataSetId;
      promises.push(MongoUtil.find(collectionName, {}));
    });
    return Promise.all(promises);
  }

  // join the columns of the datasets determined by the key parameters described in the Relationship
  function handleJoin(arrayOfDataSets) {
    const joinedData = {}
    let excludedRecordCounts = []
    _.each(arrayOfDataSets, (dataSet, dataSetIndex) => {
      excludedRecordCounts[dataSetIndex] = 0
      _.each(dataSet, (data) => {
        // generate a key based on the join field values
        let joinedDataKey = ''
        let exclude = false
        _.each(relationship.joinElements, (joinElement) => {
          const joinElementKey = joinElement[dataSetIndex]
          const keyValue = data[joinElementKey]
          if (_.isUndefined(keyValue) || _.isNull(keyValue)) {
            exclude = true
          } else {
            joinedDataKey += '_' + keyValue
          }
        })
        if (exclude) {
          // skip elements with any missing key values
          excludedRecordCounts[dataSetIndex]++
          return
        }

        let joinedDataValue = joinedData[joinedDataKey]
        if (!joinedDataValue) {
          joinedData[joinedDataKey] = joinedDataValue = {
            data: [],
            dataSetCount: 0,
            dataItemCount: 0,
          }
        }

        if (!joinedDataValue.data[dataSetIndex]) {
          joinedDataValue.data[dataSetIndex] = []
          joinedDataValue.dataSetCount++
        }
        joinedDataValue.data[dataSetIndex].push(data)
        joinedDataValue.dataItemCount++
      })
    })

    const list = []
    _.each(joinedData, (value, key) => {
      if (value.dataSetCount === arrayOfDataSets.length) {
        list.push(value)
      }
    })

    const result = {
      relationship,
      list,
      excludedRecordCounts,
    }

    return result;
  };
};

module.exports = MongoUtil;
