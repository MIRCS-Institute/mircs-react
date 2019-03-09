/*
  - update a Relationship object
*/

const _ = require('lodash')
const MongoUtil = require('../../utils/mongo-util.js')

module.exports = function(router) {
  router.put('/api/relationships/:relationshipId',
    require('../../middleware/require-sign-in'),
    (req, res, next) => {
      const updatedRelationship = _.clone(req.body)
      try {
        MongoUtil.validateRelationship(updatedRelationship)
      } catch (exception) {
        return res.status(400).send(exception.message)
      }

      // overwrite system fields from existing record
      updatedRelationship._id = req.relationship._id
      updatedRelationship.createdAt = req.relationship.createdAt
      updatedRelationship.updatedAt = new Date()

      let db
      let relationshipCollection
      MongoUtil.getDb()
        .then((theDb) => {
          db = theDb
          relationshipCollection = db.collection(MongoUtil.RELATIONSHIPS_COLLECTION)

          return relationshipCollection.updateOne({ _id: updatedRelationship._id }, updatedRelationship)
        })
        .then(() => {
          res.status(200).send(updatedRelationship)
        })
        .catch(next)
    })
}
