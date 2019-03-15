/*
  - create a new Relationship
*/

const _ = require('lodash')
const DataUtil = require('../../utils/data-util.js')

module.exports = function(router) {
  router.post('/api/relationships',
    require('../../middleware/require-sign-in'),
    (req, res, next) => {
      const newRelationship = _.clone(req.body)
      try {
        DataUtil.validateRelationship(newRelationship)
      } catch (exception) {
        return res.status(400).send(exception.message)
      }

      newRelationship.createdAt = newRelationship.updatedAt = new Date()

      let db
      let relationshipsCollection
      let relationship
      DataUtil.getDb()
        .then((theDb) => {
          db = theDb
          relationshipsCollection = db.collection(DataUtil.RELATIONSHIPS_COLLECTION)
          return relationshipsCollection.insertOne(newRelationship)
        })
        .then((result) => {
          relationship = result.ops[0]
          res.status(201).send(relationship)
        })
        .catch(next)
    })
}
