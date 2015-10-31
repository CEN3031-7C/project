'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Events_List = mongoose.model('Events_List'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, Events_List;

/**
 * Events_List routes tests
 */
describe('Events_List CRUD tests', function() {
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

		// Save a user to the test db and create new Events_List
		user.save(function() {
			Events_List = {
				name: 'Events_List Name'
			};

			done();
		});
	});

	it('should be able to save Events_List instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Events_List
				agent.post('/api/Events_Lists')
					.send(Events_List)
					.expect(200)
					.end(function(Events_ListSaveErr, Events_ListSaveRes) {
						// Handle Events_List save error
						if (Events_ListSaveErr) done(Events_ListSaveErr);

						// Get a list of Events_Lists
						agent.get('/api/Events_Lists')
							.end(function(Events_ListsGetErr, Events_ListsGetRes) {
								// Handle Events_List save error
								if (Events_ListsGetErr) done(Events_ListsGetErr);

								// Get Events_Lists list
								var Events_Lists = Events_ListsGetRes.body;

								// Set assertions
								(Events_Lists[0].user._id).should.equal(userId);
								(Events_Lists[0].name).should.match('Events_List Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Events_List instance if not logged in', function(done) {
		agent.post('/api/Events_Lists')
			.send(Events_List)
			.expect(403)
			.end(function(Events_ListSaveErr, Events_ListSaveRes) {
				// Call the assertion callback
				done(Events_ListSaveErr);
			});
	});

	it('should not be able to save Events_List instance if no name is provided', function(done) {
		// Invalidate name field
		Events_List.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Events_List
				agent.post('/api/Events_Lists')
					.send(Events_List)
					.expect(400)
					.end(function(Events_ListSaveErr, Events_ListSaveRes) {
						// Set message assertion
						(Events_ListSaveRes.body.message).should.match('Please fill Events_List name');
						
						// Handle Events_List save error
						done(Events_ListSaveErr);
					});
			});
	});

	it('should be able to update Events_List instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Events_List
				agent.post('/api/Events_Lists')
					.send(Events_List)
					.expect(200)
					.end(function(Events_ListSaveErr, Events_ListSaveRes) {
						// Handle Events_List save error
						if (Events_ListSaveErr) done(Events_ListSaveErr);

						// Update Events_List name
						Events_List.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Events_List
						agent.put('/api/Events_Lists/' + Events_ListSaveRes.body._id)
							.send(Events_List)
							.expect(200)
							.end(function(Events_ListUpdateErr, Events_ListUpdateRes) {
								// Handle Events_List update error
								if (Events_ListUpdateErr) done(Events_ListUpdateErr);

								// Set assertions
								(Events_ListUpdateRes.body._id).should.equal(Events_ListSaveRes.body._id);
								(Events_ListUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Events_Lists if not signed in', function(done) {
		// Create new Events_List model instance
		var Events_ListObj = new Events_List(Events_List);

		// Save the Events_List
		Events_ListObj.save(function() {
			// Request Events_Lists
			request(app).get('/api/Events_Lists')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Events_List if not signed in', function(done) {
		// Create new Events_List model instance
		var Events_ListObj = new Events_List(Events_List);

		// Save the Events_List
		Events_ListObj.save(function() {
			request(app).get('/api/Events_Lists/' + Events_ListObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', Events_List.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Events_List instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Events_List
				agent.post('/api/Events_Lists')
					.send(Events_List)
					.expect(200)
					.end(function(Events_ListSaveErr, Events_ListSaveRes) {
						// Handle Events_List save error
						if (Events_ListSaveErr) done(Events_ListSaveErr);

						// Delete existing Events_List
						agent.delete('/api/Events_Lists/' + Events_ListSaveRes.body._id)
							.send(Events_List)
							.expect(200)
							.end(function(Events_ListDeleteErr, Events_ListDeleteRes) {
								// Handle Events_List error error
								if (Events_ListDeleteErr) done(Events_ListDeleteErr);

								// Set assertions
								(Events_ListDeleteRes.body._id).should.equal(Events_ListSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Events_List instance if not signed in', function(done) {
		// Set Events_List user 
		Events_List.user = user;

		// Create new Events_List model instance
		var Events_ListObj = new Events_List(Events_List);

		// Save the Events_List
		Events_ListObj.save(function() {
			// Try deleting Events_List
			request(app).delete('/api/Events_Lists/' + Events_ListObj._id)
			.expect(403)
			.end(function(Events_ListDeleteErr, Events_ListDeleteRes) {
				// Set message assertion
				(Events_ListDeleteRes.body.message).should.match('User is not authorized');

				// Handle Events_List error error
				done(Events_ListDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Events_List.remove().exec(function(){
				done();
			});
		});
	});
});
