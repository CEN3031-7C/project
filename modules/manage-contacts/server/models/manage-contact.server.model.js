'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Manage contact Schema
 */
var ManageContactSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Manage contact name',
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
	zip_code: String,
	county: String,
	email: String,
	phone_number: String,
	hidden: Boolean,
	position: Number
});

mongoose.model('ManageContact', ManageContactSchema);
