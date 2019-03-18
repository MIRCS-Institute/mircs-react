const Environment = require('../utils/environment.js')
const HttpErrors = require('./http-errors')
const MongoDB = require('mongodb')

const MongoClient = MongoDB.MongoClient
const ObjectID = MongoDB.ObjectID

const MONGO_SERVER_URL = Environment.getRequired('MONGO_SERVER_URL')

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

/*
creates a new collection in the database
@see http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#createCollection
 */
const createCollection = async (collectionName, options) => {
  const db = await getDb()
  await db.createCollection(collectionName, options)
}

const insertIntoCollection = async (collectionName, record) => {
  if (record._id) {
    throw HttpErrors.badRequest400(`New record specifies _id: '${record._id}'`)
  }
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

const updateById = async (collectionName, id, update) => {
  const _id = toObjectID(id)
  const db = await getDb()
  const dataSetCollection = db.collection(collectionName)
  return await dataSetCollection.updateOne({ _id }, update)
}

module.exports = {
  getDb,
  createCollection,
  insertIntoCollection,
  find,
  toObjectID,
  findById,
  deleteById,
  updateById,
}
