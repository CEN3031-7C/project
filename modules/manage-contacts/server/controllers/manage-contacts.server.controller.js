'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	ManageContact = mongoose.model('ManageContact'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Manage contact
 */
exports.create = function(req, res) {
	var manageContact = new ManageContact(req.body);
	manageContact.user = req.user;

	manageContact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageContact);
		}
	});
};

/**
 * Show the current Manage contact
 */
exports.read = function(req, res) {
	res.jsonp(req.manageContact);
};

/**
 * Update a Manage contact
 */
exports.update = function(req, res) {
	var manageContact = req.manageContact ;

	manageContact = _.extend(manageContact , req.body);

	manageContact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageContact);
		}
	});
};

/**
 * Delete an Manage contact
 */
exports.delete = function(req, res) {
	var manageContact = req.manageContact ;

	manageContact.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageContact);
		}
	});
};

/**
 * List of Manage contacts
 */
exports.list = function(req, res) { ManageContact.find().sort('-position').populate('user', 'displayName').exec(function(err, manageContacts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageContacts);
		}
	});
};

/**
 * Manage contact middleware
 */
exports.manageContactByID = function(req, res, next, id) { ManageContact.findById(id).populate('user', 'displayName').exec(function(err, manageContact) {
		if (err) return next(err);
		if (! manageContact) return next(new Error('Failed to load Manage contact ' + id));
		req.manageContact = manageContact ;
		next();
	});
};

//exports.count = function(req, res) {
//	res = manageContact.count(); 	
//};
