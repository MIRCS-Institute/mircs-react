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

module.exports = MongoUtil;