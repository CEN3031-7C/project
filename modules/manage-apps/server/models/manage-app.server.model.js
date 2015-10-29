'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Manage app Schema
 */
var ManageAppSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Manage app name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('ManageApp', ManageAppSchema);