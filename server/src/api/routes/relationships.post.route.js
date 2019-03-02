/*
  - create a new Relationship
*/

const _ = require('lodash')
const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.post('/api/relationships',
    require('../../middleware/require-sign-in'),
    function(req, res, next) {
      const newRelationship = _.clone(req.body)
      try {
        MongoUtil.validateRelationship(newRelationship)
      } catch (exception) {
        return res.status(400).send(exception.message)
      }

      newRelationship.createdAt = newRelationship.updatedAt = new Date()

      let db
      let relationshipsCollection
      let relationship
      MongoUtil.getDb()
        .then((theDb) => {
          db = theDb
          relationshipsCollection = db.collection(MongoUtil.RELATIONSHIPS_COLLECTION)
          return relationshipsCollection.insertOne(newRelationship)
        })
        .then((result) => {
          relationship = result.ops[0]
          res.status(201).send(relationship)
        })
        .catch(next)
    })
}
