'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	ManageApp = mongoose.model('ManageApp'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Manage app
 */
exports.create = function(req, res) {
	var manageApp = new ManageApp(req.body);
	manageApp.user = req.user;

	manageApp.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageApp);
		}
	});
};

/**
 * Show the current Manage app
 */
exports.read = function(req, res) {
	res.jsonp(req.manageApp);
};

/**
 * Update a Manage app
 */
exports.update = function(req, res) {
	var manageApp = req.manageApp ;

	manageApp = _.extend(manageApp , req.body);

	manageApp.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageApp);
		}
	});
};

/**
 * Delete an Manage app
 */
exports.delete = function(req, res) {
	var manageApp = req.manageApp ;

	manageApp.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageApp);
		}
	});
};

/**
 * List of Manage apps
 */
exports.list = function(req, res) { ManageApp.find().sort('-position').populate('user', 'displayName').exec(function(err, manageApps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageApps);
		}
	});
};

/**
 * Manage app middleware
 */
exports.manageAppByID = function(req, res, next, id) { ManageApp.findById(id).populate('user', 'displayName').exec(function(err, manageApp) {
		if (err) return next(err);
		if (! manageApp) return next(new Error('Failed to load Manage app ' + id));
		req.manageApp = manageApp ;
		next();
	});
};
