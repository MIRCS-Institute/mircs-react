
module.exports = function(router) {
  router.get('/api/views/:viewId',
    async function(req, res) {
      if (!req.view) {
        return res.status(404).send({ error: 'No View found with id ' + req.params.viewId })
      }
      res.status(200).send(req.view)
    })
}
