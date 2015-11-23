'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ManageEvent = mongoose.model('ManageEvent'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, manageEvent;

/**
 * Manage event routes tests
 */
describe('Manage event CRUD tests', function() {
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

		// Save a user to the test db and create new Manage event
		user.save(function() {
			manageEvent = {
				name: 'Manage event Name'
			};

			done();
		});
	});

	it('should be able to save Manage event instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage event
				agent.post('/api/manage-events')
					.send(manageEvent)
					.expect(200)
					.end(function(manageEventSaveErr, manageEventSaveRes) {
						// Handle Manage event save error
						if (manageEventSaveErr) done(manageEventSaveErr);

						// Get a list of Manage events
						agent.get('/api/manage-events')
							.end(function(manageEventsGetErr, manageEventsGetRes) {
								// Handle Manage event save error
								if (manageEventsGetErr) done(manageEventsGetErr);

								// Get Manage events list
								var manageEvents = manageEventsGetRes.body;

								// Set assertions
								(manageEvents[0].user._id).should.equal(userId);
								(manageEvents[0].name).should.match('Manage event Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Manage event instance if not logged in', function(done) {
		agent.post('/api/manage-events')
			.send(manageEvent)
			.expect(403)
			.end(function(manageEventSaveErr, manageEventSaveRes) {
				// Call the assertion callback
				done(manageEventSaveErr);
			});
	});

	it('should not be able to save Manage event instance if no name is provided', function(done) {
		// Invalidate name field
		manageEvent.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage event
				agent.post('/api/manage-events')
					.send(manageEvent)
					.expect(400)
					.end(function(manageEventSaveErr, manageEventSaveRes) {
						// Set message assertion
						(manageEventSaveRes.body.message).should.match('Please fill Manage event name');
						
						// Handle Manage event save error
						done(manageEventSaveErr);
					});
			});
	});

	it('should be able to update Manage event instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage event
				agent.post('/api/manage-events')
					.send(manageEvent)
					.expect(200)
					.end(function(manageEventSaveErr, manageEventSaveRes) {
						// Handle Manage event save error
						if (manageEventSaveErr) done(manageEventSaveErr);

						// Update Manage event name
						manageEvent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Manage event
						agent.put('/api/manage-events/' + manageEventSaveRes.body._id)
							.send(manageEvent)
							.expect(200)
							.end(function(manageEventUpdateErr, manageEventUpdateRes) {
								// Handle Manage event update error
								if (manageEventUpdateErr) done(manageEventUpdateErr);

								// Set assertions
								(manageEventUpdateRes.body._id).should.equal(manageEventSaveRes.body._id);
								(manageEventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Manage events if not signed in', function(done) {
		// Create new Manage event model instance
		var manageEventObj = new ManageEvent(manageEvent);

		// Save the Manage event
		manageEventObj.save(function() {
			// Request Manage events
			request(app).get('/api/manage-events')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Manage event if not signed in', function(done) {
		// Create new Manage event model instance
		var manageEventObj = new ManageEvent(manageEvent);

		// Save the Manage event
		manageEventObj.save(function() {
			request(app).get('/api/manage-events/' + manageEventObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', manageEvent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Manage event instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage event
				agent.post('/api/manage-events')
					.send(manageEvent)
					.expect(200)
					.end(function(manageEventSaveErr, manageEventSaveRes) {
						// Handle Manage event save error
						if (manageEventSaveErr) done(manageEventSaveErr);

						// Delete existing Manage event
						agent.delete('/api/manage-events/' + manageEventSaveRes.body._id)
							.send(manageEvent)
							.expect(200)
							.end(function(manageEventDeleteErr, manageEventDeleteRes) {
								// Handle Manage event error error
								if (manageEventDeleteErr) done(manageEventDeleteErr);

								// Set assertions
								(manageEventDeleteRes.body._id).should.equal(manageEventSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Manage event instance if not signed in', function(done) {
		// Set Manage event user 
		manageEvent.user = user;

		// Create new Manage event model instance
		var manageEventObj = new ManageEvent(manageEvent);

		// Save the Manage event
		manageEventObj.save(function() {
			// Try deleting Manage event
			request(app).delete('/api/manage-events/' + manageEventObj._id)
			.expect(403)
			.end(function(manageEventDeleteErr, manageEventDeleteRes) {
				// Set message assertion
				(manageEventDeleteRes.body.message).should.match('User is not authorized');

				// Handle Manage event error error
				done(manageEventDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			ManageEvent.remove().exec(function(){
				done();
			});
		});
	});
});
