/*
  - create a new Relationship
*/

const _ = require('lodash');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

module.exports = function (router) {
  router.post('/api/relationships', function (req, res, next) {
    MongoUtil.createRelationship().then(function (hey) {
      res.status(200).send(hey);
    })
  });
};