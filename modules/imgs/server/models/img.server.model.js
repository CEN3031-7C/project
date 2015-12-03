'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Img Schema
 */
var ImgSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Img name',
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

mongoose.model('Img', ImgSchema);