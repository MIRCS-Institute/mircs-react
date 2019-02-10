//
// Starts the MIRCS server
//

const cors = require('cors')
const createRouterForDir = require('./utils/create-router-for-dir.js')
const Environment = require('./utils/environment.js')
const express = require('express')
const helmet = require('helmet')
const log = require('./utils/log.js')
const morgan = require('morgan')
const MongoUtil = require('./utils/mongo-util.js')
const path = require('path')

const PORT = Environment.getRequired('PORT')
const LOG_FORMAT = Environment.getRequired('LOG_FORMAT')

const app = express()

// see https://helmetjs.github.io/docs/ for list of protections helmet adds
app.use(helmet())

// logging for all routes
app.use(morgan(LOG_FORMAT))

// set up CORS with a max-age header, to save browser re-requests of OPTIONS for each route
const MAX_AGE_SECONDS = 24 * 60 * 60
app.use(cors({ maxAge: MAX_AGE_SECONDS }))

// serve the contents of public as static content
app.use(express.static(path.join(__dirname, '..', 'public')))

// for parsing application/json in request body
app.use(express.json({ limit: '50mb' }))

// register the api
app.use(createRouterForDir(path.join(__dirname, 'api')))

// return 404 for unknown commands
app.all('*', function(req, res) {
  log.info('404 - Unknown command', {
    method: req.method,
    path: req.path,
    query: req.query,
    params: req.params,
    headers: req.headers,
    body: req.body,
  })
  res.status(404).send({ error: `Cannot ${req.method} ${req.path}` })
})

MongoUtil.initialize()
  .then(() => {
    app.listen(PORT, function() {
      log.info(`expressjs server is listening on port ${PORT}...`)
    })
  })
  .catch((error) => {
    console.error('Error starting server.', error)
  })
