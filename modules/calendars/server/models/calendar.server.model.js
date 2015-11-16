'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Calendar Schema
 */
var CalendarSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	title: String,
	imageURL: String,
	date: String,
	summary: String,
	link: String,
	pending: Boolean,
	hidden: Boolean
});

mongoose.model('Calendar', CalendarSchema);