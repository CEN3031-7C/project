'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Calendar = mongoose.model('Calendar'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Calendar
 */
exports.create = function(req, res) {
	var calendar = new Calendar(req.body);
	calendar.user = req.user;

	calendar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};

/**
 * Show the current Calendar
 */
exports.read = function(req, res) {
	res.jsonp(req.calendar);
};

/**
 * Update a Calendar
 */
exports.update = function(req, res) {
	var calendar = req.calendar ;

	calendar = _.extend(calendar , req.body);

	calendar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};

/**
 * Delete an Calendar
 */
exports.delete = function(req, res) {
	var calendar = req.calendar ;

	calendar.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};

/**
 * List of Calendars
 */
exports.list = function(req, res) { Calendar.find().sort('-created').populate('user', 'displayName').exec(function(err, calendars) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendars);
		}
	});
};

/**
 * Calendar middleware
 */
exports.calendarByID = function(req, res, next, id) { Calendar.findById(id).populate('user', 'displayName').exec(function(err, calendar) {
		if (err) return next(err);
		if (! calendar) return next(new Error('Failed to load Calendar ' + id));
		req.calendar = calendar ;
		next();
	});
};