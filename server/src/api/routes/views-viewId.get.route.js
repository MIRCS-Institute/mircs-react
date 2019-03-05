
module.exports = (router) => {
  router.get('/api/views/:viewId',
    (req, res) => {
      res.status(200).send(req.view)
    })
}
