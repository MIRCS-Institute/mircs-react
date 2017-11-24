/*
  - fetch the related records, as described by the Relationships pertaining to this DataSet
*/

module.exports = function (router) {
    router.get('/api/datasets/:dataSetId/records/:recordId/related-records', function (req, res, next) {

        // TODO: implement

        res.status(500).send({error: 'Unimplemented'});
    });
};