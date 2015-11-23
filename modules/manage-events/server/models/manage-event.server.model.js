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
	date: {
		type : Date,
		default: Date.now
	},
	link : String,
	imageURL : String,
	pending : Boolean
});	

//IMPLEMENT FOR FEEDBACK
var feedbackSchema = new Schema({
	feedback: {
		type: String,
		default: "No Feedback"
	},
	id : String
});



mongoose.model('ManageEvent', ManageEventSchema);
mongoose.model('feedback', feedbackSchema);