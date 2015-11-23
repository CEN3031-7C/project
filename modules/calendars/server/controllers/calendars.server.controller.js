'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Calendar = mongoose.model('Calendar'),
	ManageEvent = mongoose.model('ManageEvent'),

	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var google = require('../../../../node_modules/googleapis/lib/googleapis.js');
//var urlshortener = google.urlshortener('v1');
var gcalendars = google.calendar('v3');

var printResult = function(err, result) {
  if (err) {
    console.log('Error occurred: ', err);
  } else {
    console.log('Result: ', result);
  }
};

//urlshortener.url.get({ shortUrl: 'http://goo.gl/DdUKX' }, printResult);
//urlshortener.url.insert({ resource: {
//    longUrl: 'http://somelongurl.com' }
//}, printResult);

/**
 * Create a Calendar
 */
exports.create = function(req, res) {
	console.log('createMongo called');
	var calendar = new Calendar(req.body);
	calendar.user = req.user;

	calendar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};

/**
 * Create mongoDB event
 */

 exports.createMongo = function(req, res) {
 	console.log('createMongo called');
	var manageEvent = new ManageEvent(req.body);
	manageEvent.user = req.user;

	manageEvent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(manageEvent);
		}
	});
};

/**
 * Show the current Calendar
 */
exports.read = function(req, res) {
	res.jsonp(req.calendar);
};

/**
 * Update a Calendar
 */
exports.update = function(req, res) {
	var calendar = req.calendar ;

	calendar = _.extend(calendar , req.body);

	calendar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};

/**
 * Delete an Calendar
 */
exports.delete = function(req, res) {
	var calendar = req.calendar ;

	calendar.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};


/*
 * List of Calendars
 */
 
exports.list = function(req, res) { Calendar.find().sort('-created').populate('user', 'displayName').exec(function(err, calendars) {
		//urlshortener.url.get({ shortUrl: 'http://goo.gl/DdUKX' }, printResult);
		//gcalendars.events.list({calendarId: 'eecf6gh212hbtsl4c750q9d6rk@group.calendar.google.com', key: 'AIzaSyCfsxDnK7heHQqY6_3hAW17s512VpjOKds'}, printResult);
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//res.jsonp(calendars);
			gcalendars.events.list({calendarId: 'watereevents@gmail.com', key: ' AIzaSyBis_Ck10Drh3n2TVkYr5ej9YyzYNLPPGk'}, function(err, result){
				if (err) {
	    			console.log('Error occurred: ', err);
	 			 } else {
	  			    var returnJSON = {items: []};
	  	// ISSA: I changed the Loop from 0 to length -1 to be from 0 to length

	  			    for(var i = 0; i < result.items.length; i++){
	  			    	//console.log('Test: ', result.items[i].summary);
	  			    	
						returnJSON.items.push(result.items[i]);	//First, we get the info from google calendars
		// I commit out the following two lines:
						//returnJSON.items[i].user = calendars[i].user;	//We then add the info that we want from our Mongo Database (additional stuff)
						//returnJSON.items[i].imageURL = calendars[i].imageURL;

		// I added this line, which only display the user of index [1]
						returnJSON.items[i].user = calendars[1].user;
						//console.log('Test 2: ', returnJSON);
	  			    }

	  			    res.jsonp(returnJSON.items);
	  		
	  			}
			});
		}
	});
};

/*
exports.list = function(req, res) { Calendar.find().sort('-created').populate('user', 'displayName').exec(function(err, calendars) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendars);
		}
	});
};
/*

/*
 * Calendar middleware
 */
exports.calendarByID = function(req, res, next, id) { Calendar.findById(id).populate('user', 'displayName').exec(function(err, calendar) {
		if (err) return next(err);
		if (! calendar) return next(new Error('Failed to load Calendar ' + id));
		req.calendar = calendar ;
		next();
	});
};
