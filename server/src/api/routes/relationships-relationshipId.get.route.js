/*
  - fetch an identified Relationship object
*/

module.exports = function (router) {
  router.get('/api/relationships/:relationshipId',
    (req, res) => {
      res.status(200).send(req.relationship)
    })
}
