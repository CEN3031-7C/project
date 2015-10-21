'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PendingEvent = mongoose.model('PendingEvent'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, pendingEvent;

/**
 * Pending event routes tests
 */
describe('Pending event CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Pending event
		user.save(function() {
			pendingEvent = {
				name: 'Pending event Name'
			};

			done();
		});
	});

	it('should be able to save Pending event instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pending event
				agent.post('/api/pending-events')
					.send(pendingEvent)
					.expect(200)
					.end(function(pendingEventSaveErr, pendingEventSaveRes) {
						// Handle Pending event save error
						if (pendingEventSaveErr) done(pendingEventSaveErr);

						// Get a list of Pending events
						agent.get('/api/pending-events')
							.end(function(pendingEventsGetErr, pendingEventsGetRes) {
								// Handle Pending event save error
								if (pendingEventsGetErr) done(pendingEventsGetErr);

								// Get Pending events list
								var pendingEvents = pendingEventsGetRes.body;

								// Set assertions
								(pendingEvents[0].user._id).should.equal(userId);
								(pendingEvents[0].name).should.match('Pending event Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pending event instance if not logged in', function(done) {
		agent.post('/api/pending-events')
			.send(pendingEvent)
			.expect(403)
			.end(function(pendingEventSaveErr, pendingEventSaveRes) {
				// Call the assertion callback
				done(pendingEventSaveErr);
			});
	});

	it('should not be able to save Pending event instance if no name is provided', function(done) {
		// Invalidate name field
		pendingEvent.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pending event
				agent.post('/api/pending-events')
					.send(pendingEvent)
					.expect(400)
					.end(function(pendingEventSaveErr, pendingEventSaveRes) {
						// Set message assertion
						(pendingEventSaveRes.body.message).should.match('Please fill Pending event name');
						
						// Handle Pending event save error
						done(pendingEventSaveErr);
					});
			});
	});

	it('should be able to update Pending event instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pending event
				agent.post('/api/pending-events')
					.send(pendingEvent)
					.expect(200)
					.end(function(pendingEventSaveErr, pendingEventSaveRes) {
						// Handle Pending event save error
						if (pendingEventSaveErr) done(pendingEventSaveErr);

						// Update Pending event name
						pendingEvent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pending event
						agent.put('/api/pending-events/' + pendingEventSaveRes.body._id)
							.send(pendingEvent)
							.expect(200)
							.end(function(pendingEventUpdateErr, pendingEventUpdateRes) {
								// Handle Pending event update error
								if (pendingEventUpdateErr) done(pendingEventUpdateErr);

								// Set assertions
								(pendingEventUpdateRes.body._id).should.equal(pendingEventSaveRes.body._id);
								(pendingEventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pending events if not signed in', function(done) {
		// Create new Pending event model instance
		var pendingEventObj = new PendingEvent(pendingEvent);

		// Save the Pending event
		pendingEventObj.save(function() {
			// Request Pending events
			request(app).get('/api/pending-events')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pending event if not signed in', function(done) {
		// Create new Pending event model instance
		var pendingEventObj = new PendingEvent(pendingEvent);

		// Save the Pending event
		pendingEventObj.save(function() {
			request(app).get('/api/pending-events/' + pendingEventObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pendingEvent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pending event instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pending event
				agent.post('/api/pending-events')
					.send(pendingEvent)
					.expect(200)
					.end(function(pendingEventSaveErr, pendingEventSaveRes) {
						// Handle Pending event save error
						if (pendingEventSaveErr) done(pendingEventSaveErr);

						// Delete existing Pending event
						agent.delete('/api/pending-events/' + pendingEventSaveRes.body._id)
							.send(pendingEvent)
							.expect(200)
							.end(function(pendingEventDeleteErr, pendingEventDeleteRes) {
								// Handle Pending event error error
								if (pendingEventDeleteErr) done(pendingEventDeleteErr);

								// Set assertions
								(pendingEventDeleteRes.body._id).should.equal(pendingEventSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pending event instance if not signed in', function(done) {
		// Set Pending event user 
		pendingEvent.user = user;

		// Create new Pending event model instance
		var pendingEventObj = new PendingEvent(pendingEvent);

		// Save the Pending event
		pendingEventObj.save(function() {
			// Try deleting Pending event
			request(app).delete('/api/pending-events/' + pendingEventObj._id)
			.expect(403)
			.end(function(pendingEventDeleteErr, pendingEventDeleteRes) {
				// Set message assertion
				(pendingEventDeleteRes.body.message).should.match('User is not authorized');

				// Handle Pending event error error
				done(pendingEventDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			PendingEvent.remove().exec(function(){
				done();
			});
		});
	});
});
