/*
  - delete a Relationship
*/

const DataUtil = require('../../utils/data-util.js')

module.exports = function(router) {
  router.delete('/api/relationships/:relationshipId',
    require('../../middleware/require-sign-in'),
    (req, res, next) => {
      let db
      DataUtil.getDb()
        .then((theDb) => {
          db = theDb

          const relationshipsCollection = db.collection(DataUtil.RELATIONSHIPS_COLLECTION)
          const _id = DataUtil.toObjectID(req.params.relationshipId)
          return relationshipsCollection.deleteOne({ _id })
        })
        .then(() => {
          res.status(200).send({ result: 'deleted' })
        })
        .catch(next)
    })
}
