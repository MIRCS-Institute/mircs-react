const _ = require('lodash')
const Environment = require('../utils/environment.js')
const HttpErrors = require('./http-errors')
const MongoDB = require('mongodb')

const MongoClient = MongoDB.MongoClient
const ObjectID = MongoDB.ObjectID

const MONGO_SERVER_URL = Environment.getRequired('MONGO_SERVER_URL')

const AUTHENTICATION_COLLECTION = 'Authentication'
const DATA_SETS_COLLECTION = 'DataSets'
const RELATIONSHIPS_COLLECTION = 'Relationships'
const VIEWS_COLLECTION = 'Views'
const DATA_SETS_COLLECTION_PREFIX = 'dataset_'
const DATA_SETS_FIELDS_COLLECTION_SUFFIX = '_fields'

// MongoClient connection pool
let db

/*
Connects to MongoDB and returns a promise that resolves to a Database object connected to
our database.

@see https://mongodb.github.io/node-mongodb-native/2.2/api/Db.html

@see https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connection-pooling
  "To reduce the number of connection pools created by your application, we recommend calling
  MongoClient.connect once and reusing the database variable returned by the callback"
*/
const getDb = async () => {
  if (!db) {
    db = await MongoClient.connect(MONGO_SERVER_URL)
  }
  return db
}

const initialize = async () => {
  db = await getDb()

  const auth = await db.createCollection(AUTHENTICATION_COLLECTION)
  await auth.createIndex({ email: 1 }, { unique: true })

  await createCollection(DATA_SETS_COLLECTION)

  await createCollection(RELATIONSHIPS_COLLECTION)
}

const validateRelationship = (relationship) => {
  if (!_.isString(relationship.name)) {
    throw HttpErrors.badRequest400('name is required')
  }
  if (!_.isArray(relationship.dataSets)) {
    throw HttpErrors.badRequest400('dataSets array is required')
  }
  if (!_.isArray(relationship.joinElements)) {
    throw HttpErrors.badRequest400('joinElements array is required')
  }
  _.each(relationship.joinElements, (joinElement) => {
    if (relationship.dataSets.length !== joinElement.length) {
      throw HttpErrors.badRequest400('joinElements arrays must be the same length as dataSets')
    }
  })
}

const validateView = (view) => {
  if (!_.isString(view.name)) {
    throw HttpErrors.badRequest400('name is required')
  }
}

/*
creates a new collection in the database
@see http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#createCollection
 */
const createCollection = async (collectionName, options) => {
  const db = await getDb()
  await db.createCollection(collectionName, options)
}

const insertIntoCollection = async (collectionName, record) => {
  const db = await getDb()
  const viewsCollection = db.collection(collectionName)
  const result = await viewsCollection.insertOne(record)
  return result.ops[0]
}

/*
finds and returns documents in a collection matching the passed query
@see http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#find
*/
const find = async (collectionName, query) => {
  const db = await getDb()
  const result = await db.collection(collectionName).find(query).toArray()
  return result
}

const toObjectID = (id) => {
  try {
    return ObjectID(id)
  } catch(exception) {
    console.error(exception)
    throw HttpErrors.badRequest400(`Invalid ObjectID: '${id}' ${exception.message}`)
  }
}

const findById = async (collectionName, id) => {
  const _id = toObjectID(id)
  const list = await find(collectionName, { _id })
  return list[0]
}

const deleteById = async (collectionName, id) => {
  const _id = toObjectID(id)
  const db = await getDb()
  const collection = db.collection(collectionName)
  await collection.deleteOne({ _id })
}

/*
update the fields collection associated with a collection
*/
const refreshFields = async (db, collectionName) => {
  const fields = await new Promise((resolve, reject) => {
    const cursor = db.collection(collectionName).find()
    const fields = {}
    cursor.each((err, item) => {
      if (err) {
        return reject(err)
      }

      if (item === null) {
        // cursor is exhausted
        return resolve(fields)
      }

      // in the case of GeoJSON we use properties for the fields
      if (typeof item.properties === 'object') {
        item = item.properties
      }

      _.each(item, (value, key) => {
        if (value) {
          fields[key] = typeof value
        }
      })
    })
  })

  const fieldsCollection = db.collection(collectionName + DATA_SETS_FIELDS_COLLECTION_SUFFIX)
  await fieldsCollection.remove({})
  const fieldDocs = []
  _.each(fields, (type, _id) => {
    fieldDocs.push({ _id, type })
  })
  if (fieldDocs.length > 0) {
    return await fieldsCollection.insertMany(fieldDocs)
  }
}

/*
from a relationship object fetch the set of joined records
 */
const joinRecords = (relationship) => {
  if (_.get(relationship, 'dataSets.length') !== 2) {
    return Promise.reject(HttpErrors.badRequest400('currently limited to relationships with 2 data sets'))
  }

  return collectDataSets() // grab the dataSet records from the database
    .then(handleJoin) // find matching tuples and merge them, return as a new set of records

  // return a promise resolving to an array of arrays of dataset records
  function collectDataSets() {
    const promises = []
    _.each(relationship.dataSets, (dataSetId) => {
      const collectionName = DATA_SETS_COLLECTION_PREFIX + dataSetId
      promises.push(find(collectionName, {}))
    })
    return Promise.all(promises)
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
          let properties = data
          if (typeof data.properties === 'object') {
            // GeoJSON object, look to the properties
            properties = data.properties
          }
          const keyValue = properties[joinElementKey]
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
    _.each(joinedData, (value) => {
      if (value.dataSetCount === arrayOfDataSets.length) {
        list.push(value)
      }
    })

    const result = {
      relationship,
      list,
      excludedRecordCounts,
    }

    return result
  }
}

module.exports = {
  AUTHENTICATION_COLLECTION,
  DATA_SETS_COLLECTION,
  RELATIONSHIPS_COLLECTION,
  VIEWS_COLLECTION,
  DATA_SETS_COLLECTION_PREFIX,
  DATA_SETS_FIELDS_COLLECTION_SUFFIX,

  getDb,
  createCollection,
  insertIntoCollection,
  find,
  toObjectID,
  findById,
  deleteById,

  initialize,
  validateRelationship,
  validateView,
  refreshFields,
  joinRecords,
}
