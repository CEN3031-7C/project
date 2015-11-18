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
		required: 'Please fill apps name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	description: String,
	imageURL: String,
	appLink: String,
	hidden: Boolean,
	position: Number
});

mongoose.model('ManageApp', ManageAppSchema);