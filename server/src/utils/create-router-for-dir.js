const _ = require('lodash')
const express = require('express')
const FsUtil = require('../utils/fs-util.js')
const log = require('../utils/log.js')
const path = require('path')

//
// Scans the contents of [dir]/param, [dir]/middleware, and [dir]/routes for well-named files and executes functions within
// them, giving us a route-declaration-by-convention mechanism.
//
function createRouterForDir(dir) {
  const router = new express.Router()

  if (log.level() <= log.TRACE) {
    // log all requests
    router.use(function(req, res, next) {
      log.trace(req.method, req.path, JSON.stringify({
        body: req.body,
        headers: req.headers,
        query: req.query,
        params: req.params,
      }, null, 2))
      next()
    })
  }

  // add middleware
  FsUtil.forEachFileInDir(path.join(dir, 'middleware'), '.middleware.js', function(filePath) {
    try {
      router.use(require(filePath))
    } catch (exception) {
      log.fatal(`Error starting middleware ${filePath}:`, exception)
      throw exception
    }
  })

  // add params
  FsUtil.forEachFileInDir(path.join(dir, 'params'), '.param.js', function(filePath) {
    try {
      require(filePath)(router)
    } catch (exception) {
      log.fatal(`Error starting param handler ${filePath}:`, exception)
      throw exception
    }
  })

  // add routes
  FsUtil.forEachFileInDir(path.join(dir, 'routes'), '.route.js', function(filePath) {
    try {
      require(filePath)(router)
    } catch (exception) {
      log.fatal(`Error starting route ${filePath}:`, exception)
      throw exception
    }
  })

  // list all registered routes
  if (log.level() === log.TRACE) {
    (function listAllRoutes() {
      var routes = router.stack
      var routesMapping = []
      _.each(routes, function(val) {
        if (val.route) {
          val = val.route
          var method = (val.stack[0].method || 'all').toUpperCase()
          routesMapping.push(method + ': ' + val.path)
        }
      })
      log.trace(`Registered routes for ${dir}:\n    ${routesMapping.join('\n    ')}`)
    })()
  }

  return function(req, res, next) {
    return router(req, res, onRouteError)

    function onRouteError(error) {
      if (!error) {
        return next()
      }

      const response = { message: _.get(error, 'message', '') }
      const statusCode = _.get(error, 'status', 500)

      if (error) {
        const logLevel = (statusCode === 500) ? 'error' : 'info'
        log[logLevel]('Error handling request', req.method, req.path, {
          query: req.query,
          params: req.params,
          headers: req.headers,
          body: req.body,
        }, '\nerror:', error)

        // include error details in response when in engineering mode
        if (log.level() <= log.DEBUG) {
          response.stack = error.stack || error.toString()
        }
      }

      res.status(statusCode).send(response)
    }
  }
}

module.exports = createRouterForDir
