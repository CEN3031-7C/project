'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Manage event Schema
 */
var ManageEventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Manage event name',
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

mongoose.model('ManageEvent', ManageEventSchema);