'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Img = mongoose.model('Img'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Img
 */
exports.create = function(req, res) {
	var img = new Img(req.body);
	img.user = req.user;

	img.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(img);
		}
	});
};

/**
 * Show the current Img
 */
exports.read = function(req, res) {
	res.jsonp(req.img);
};

/**
 * Update a Img
 */
exports.update = function(req, res) {
	var img = req.img ;

	img = _.extend(img , req.body);

	img.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(img);
		}
	});
};

/**
 * Delete an Img
 */
exports.delete = function(req, res) {
	var img = req.img ;

	img.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(img);
		}
	});
};

/**
 * List of Imgs
 */
exports.list = function(req, res) { Img.find().sort('position').populate('user', 'displayName').exec(function(err, imgs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(imgs);
		}
	});
};

/**
 * Img middleware
 */
exports.imgByID = function(req, res, next, id) { Img.findById(id).populate('user', 'displayName').exec(function(err, img) {
		if (err) return next(err);
		if (! img) return next(new Error('Failed to load Img ' + id));
		req.img = img ;
		next();
	});
};