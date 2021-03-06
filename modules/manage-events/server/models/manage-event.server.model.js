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
		required: 'Please fill event name',
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
	date: Date,
	link : String,
	imageURL : String,
	pending : Boolean
});	



mongoose.model('ManageEvent', ManageEventSchema);
