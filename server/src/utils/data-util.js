const _ = require('lodash')
const HttpErrors = require('./http-errors')
const MongoUtil = require('./mongo-util')

const AUTHENTICATION_COLLECTION = 'Authentication'
const DATA_SETS_COLLECTION = 'DataSets'
const RELATIONSHIPS_COLLECTION = 'Relationships'
const VIEWS_COLLECTION = 'Views'
const DATA_SETS_COLLECTION_PREFIX = 'dataset_'
const DATA_SETS_FIELDS_COLLECTION_SUFFIX = '_fields'

const initialize = async () => {
  const db = await MongoUtil.getDb()

  const auth = await db.collection(AUTHENTICATION_COLLECTION)
  await auth.createIndex({ email: 1 }, { unique: true })

  await db.collection(DATA_SETS_COLLECTION)

  await db.collection(RELATIONSHIPS_COLLECTION)
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
      promises.push(MongoUtil.find(collectionName, {}))
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

module.exports = _.extend({}, MongoUtil, {
  AUTHENTICATION_COLLECTION,
  DATA_SETS_COLLECTION,
  RELATIONSHIPS_COLLECTION,
  VIEWS_COLLECTION,
  DATA_SETS_COLLECTION_PREFIX,
  DATA_SETS_FIELDS_COLLECTION_SUFFIX,

  initialize,
  validateRelationship,
  validateView,
  refreshFields,
  joinRecords,
})
