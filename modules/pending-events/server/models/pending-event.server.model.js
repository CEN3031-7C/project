'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pending event Schema
 */
var PendingEventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Pending event name',
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

mongoose.model('PendingEvent', PendingEventSchema);