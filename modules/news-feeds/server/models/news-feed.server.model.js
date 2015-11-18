'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * News feed Schema
 */
var NewsFeedSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill News feed name',
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
	author: String,
	body_text: String,
	imageURL: String,
	date: Date,
	articleLink: String,
	hidden: Boolean,
	position: Number
});

mongoose.model('NewsFeed', NewsFeedSchema);