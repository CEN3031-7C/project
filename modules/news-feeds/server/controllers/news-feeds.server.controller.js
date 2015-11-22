'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	NewsFeed = mongoose.model('NewsFeed'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a News feed
 */
exports.create = function(req, res) {
	var newsFeed = new NewsFeed(req.body);
	newsFeed.user = req.user;

	newsFeed.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newsFeed);
		}
	});
};

/**
 * Show the current News feed
 */
exports.read = function(req, res) {
	res.jsonp(req.newsFeed);
};

/**
 * Update a News feed
 */
exports.update = function(req, res) {
	var newsFeed = req.newsFeed ;

	newsFeed = _.extend(newsFeed , req.body);

	newsFeed.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newsFeed);
		}
	});
};

/**
 * Delete an News feed
 */
exports.delete = function(req, res) {
	var newsFeed = req.newsFeed ;

	newsFeed.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newsFeed);
		}
	});
};

/**
 * List of News feeds
 */
exports.list = function(req, res) { NewsFeed.find().sort('-position').populate('user', 'displayName').exec(function(err, newsFeeds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(newsFeeds);
		}
	});
};

/**
 * News feed middleware
 */
exports.newsFeedByID = function(req, res, next, id) { NewsFeed.findById(id).populate('user', 'displayName').exec(function(err, newsFeed) {
		if (err) return next(err);
		if (! newsFeed) return next(new Error('Failed to load News feed ' + id));
		req.newsFeed = newsFeed ;
		next();
	});
};