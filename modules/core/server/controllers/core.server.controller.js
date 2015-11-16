'use strict';

var _ = require('lodash'),
 path = require('path'),
 mongoose = require('mongoose'),
 ManageApp = mongoose.model('ManageApp'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.list = function(req, res) { console.log("Hey!"); ManageApp.find().sort('position').populate('user', 'displayName').exec(function(err, manageApps) {
   if (err) {
     return res.status(400).send({
       message: errorHandler.getErrorMessage(err)
     });
   } else {
     res.jsonp(manageApps);
   }
 });
};