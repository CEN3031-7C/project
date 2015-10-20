'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	PendingEvent = mongoose.model('PendingEvent'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Pending event
 */
exports.create = function(req, res) {
	var pendingEvent = new PendingEvent(req.body);
	pendingEvent.user = req.user;

	pendingEvent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pendingEvent);
		}
	});
};

/**
 * Show the current Pending event
 */
exports.read = function(req, res) {
	res.jsonp(req.pendingEvent);
};

/**
 * Update a Pending event
 */
exports.update = function(req, res) {
	var pendingEvent = req.pendingEvent ;

	pendingEvent = _.extend(pendingEvent , req.body);

	pendingEvent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pendingEvent);
		}
	});
};

/**
 * Delete an Pending event
 */
exports.delete = function(req, res) {
	var pendingEvent = req.pendingEvent ;

	pendingEvent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pendingEvent);
		}
	});
};

/**
 * List of Pending events
 */
exports.list = function(req, res) { PendingEvent.find().sort('-created').populate('user', 'displayName').exec(function(err, pendingEvents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pendingEvents);
		}
	});
};

/**
 * Pending event middleware
 */
exports.pendingEventByID = function(req, res, next, id) { PendingEvent.findById(id).populate('user', 'displayName').exec(function(err, pendingEvent) {
		if (err) return next(err);
		if (! pendingEvent) return next(new Error('Failed to load Pending event ' + id));
		req.pendingEvent = pendingEvent ;
		next();
	});
};