//
// Starts the MIRCS server
//

// set up __server_src_dir global variable, available to all modules
global.__server_src_dir = __dirname + '/';

const cors = require('cors');
const createRouterForDir = require(__server_src_dir + 'utils/create-router-for-dir.js');
const Environment = require(__server_src_dir + 'utils/environment.js');
const express = require('express');
const log = require(__server_src_dir + 'utils/log.js');
const logger = require('morgan');
const path = require('path');
const MongoUtil = require(__server_src_dir + 'utils/mongo-util.js');

const app = express();

// logging for all routes
app.use(logger('dev'));

// set up CORS with a max-age header, to save browser re-requests of OPTIONS for each route
const ONE_HOUR_SECONDS = 60 * 60;
const MAX_AGE_SECONDS = ONE_HOUR_SECONDS;
app.use(cors({ maxAge: MAX_AGE_SECONDS }));

// expose build output of the react-app
app.use(express.static(path.join(__server_src_dir, '../../react-app/build')));

// register the api
app.use(createRouterForDir('api'));

// return 404 for unknown commands
app.all('*', function(req, res) {
  log.info('404 - Unknown command', {
    method: req.method,
    path: req.path,
    query: req.query,
    params: req.params,
    headers: req.headers,
    body: req.body
  });
  res.status(404).send({ error: `Cannot ${req.method} ${req.path}` });
});

const PORT = Environment.getRequired('SERVER_PORT');
app.listen(PORT, function() {
  log.info(`expressjs server is listening on port ${PORT}...`);
});


// Create collection
MongoUtil.initialize();
