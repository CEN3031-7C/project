'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Feedback = mongoose.model('Feedback'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Feedback
 */
exports.create = function(req, res) {
	var feedback = new Feedback(req.body);
	feedback.user = req.user;

	feedback.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feedback);
		}
	});
};

/**
 * Show the current Feedback
 */
exports.read = function(req, res) {
	res.jsonp(req.feedback);
};

/**
 * Update a Feedback
 */
exports.update = function(req, res) {
	var feedback = req.feedback ;

	feedback = _.extend(feedback , req.body);

	feedback.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feedback);
		}
	});
};

/**
 * Delete an Feedback
 */
exports.delete = function(req, res) {
	var feedback = req.feedback ;

	feedback.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feedback);
		}
	});
};

/**
 * List of Feedbacks
 */
exports.list = function(req, res) { Feedback.find().sort('-created').populate('user', 'displayName').exec(function(err, feedbacks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feedbacks);
		}
	});
};

/**
 * Feedback middleware
 */
exports.feedbackByID = function(req, res, next, id) { Feedback.findById(id).populate('user', 'displayName').exec(function(err, feedback) {
		if (err) return next(err);
		if (! feedback) return next(new Error('Failed to load Feedback ' + id));
		req.feedback = feedback ;
		next();
	});
};