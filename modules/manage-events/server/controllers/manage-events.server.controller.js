'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	ManageEvent = mongoose.model('ManageEvent'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Manage event
 */
exports.create = function(req, res) {
	var manageEvent = new ManageEvent(req.body);
	manageEvent.user = req.user;

	manageEvent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageEvent);
		}
	});
};

/**
 * Show the current Manage event
 */
exports.read = function(req, res) {
	res.jsonp(req.manageEvent);
};

/**
 * Update a Manage event
 */
exports.update = function(req, res) {
	var manageEvent = req.manageEvent ;

	manageEvent = _.extend(manageEvent , req.body);

	manageEvent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageEvent);
		}
	});
};

/**
 * Delete an Manage event
 */
exports.delete = function(req, res) {
	var manageEvent = req.manageEvent ;

	manageEvent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageEvent);
		}
	});
};

/**
 * List of Manage events
 */
exports.list = function(req, res) { ManageEvent.find().sort('-created').populate('user', 'displayName').exec(function(err, manageEvents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageEvents);
		}
	});
};

/**
 * Manage event middleware
 */
exports.manageEventByID = function(req, res, next, id) { ManageEvent.findById(id).populate('user', 'displayName').exec(function(err, manageEvent) {
		if (err) return next(err);
		if (! manageEvent) return next(new Error('Failed to load Manage event ' + id));
		req.manageEvent = manageEvent ;
		next();
	});
};