/*
  - delete a Relationship
*/

module.exports = function (router) {
    router.delete('/api/relationships/:relationshipId', function (req, res, next) {

        // TODO: implement

        res.status(500).send({error: 'Unimplemented'});
    });
};