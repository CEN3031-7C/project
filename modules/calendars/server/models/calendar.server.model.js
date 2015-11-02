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
	summary: {
		type: String,
		default: '',
		required: 'Please fill Calendar name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	imageURL: {
		type: String,
		default: '',
		require: 'Please fill image url'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Calendar', CalendarSchema);