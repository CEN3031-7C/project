'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ManageApp = mongoose.model('ManageApp'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, manageApp;

/**
 * Manage app routes tests
 */
describe('Manage app CRUD tests', function() {
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

		// Save a user to the test db and create new Manage app
		user.save(function() {
			manageApp = {
				name: 'Manage app Name'
			};

			done();
		});
	});

	it('should be able to save Manage app instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage app
				agent.post('/api/manage-apps')
					.send(manageApp)
					.expect(200)
					.end(function(manageAppSaveErr, manageAppSaveRes) {
						// Handle Manage app save error
						if (manageAppSaveErr) done(manageAppSaveErr);

						// Get a list of Manage apps
						agent.get('/api/manage-apps')
							.end(function(manageAppsGetErr, manageAppsGetRes) {
								// Handle Manage app save error
								if (manageAppsGetErr) done(manageAppsGetErr);

								// Get Manage apps list
								var manageApps = manageAppsGetRes.body;

								// Set assertions
								(manageApps[0].user._id).should.equal(userId);
								(manageApps[0].name).should.match('Manage app Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Manage app instance if not logged in', function(done) {
		agent.post('/api/manage-apps')
			.send(manageApp)
			.expect(403)
			.end(function(manageAppSaveErr, manageAppSaveRes) {
				// Call the assertion callback
				done(manageAppSaveErr);
			});
	});

	it('should not be able to save Manage app instance if no name is provided', function(done) {
		// Invalidate name field
		manageApp.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage app
				agent.post('/api/manage-apps')
					.send(manageApp)
					.expect(400)
					.end(function(manageAppSaveErr, manageAppSaveRes) {
						// Set message assertion
						(manageAppSaveRes.body.message).should.match('Please fill Manage app name');
						
						// Handle Manage app save error
						done(manageAppSaveErr);
					});
			});
	});

	it('should be able to update Manage app instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage app
				agent.post('/api/manage-apps')
					.send(manageApp)
					.expect(200)
					.end(function(manageAppSaveErr, manageAppSaveRes) {
						// Handle Manage app save error
						if (manageAppSaveErr) done(manageAppSaveErr);

						// Update Manage app name
						manageApp.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Manage app
						agent.put('/api/manage-apps/' + manageAppSaveRes.body._id)
							.send(manageApp)
							.expect(200)
							.end(function(manageAppUpdateErr, manageAppUpdateRes) {
								// Handle Manage app update error
								if (manageAppUpdateErr) done(manageAppUpdateErr);

								// Set assertions
								(manageAppUpdateRes.body._id).should.equal(manageAppSaveRes.body._id);
								(manageAppUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Manage apps if not signed in', function(done) {
		// Create new Manage app model instance
		var manageAppObj = new ManageApp(manageApp);

		// Save the Manage app
		manageAppObj.save(function() {
			// Request Manage apps
			request(app).get('/api/manage-apps')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Manage app if not signed in', function(done) {
		// Create new Manage app model instance
		var manageAppObj = new ManageApp(manageApp);

		// Save the Manage app
		manageAppObj.save(function() {
			request(app).get('/api/manage-apps/' + manageAppObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', manageApp.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Manage app instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage app
				agent.post('/api/manage-apps')
					.send(manageApp)
					.expect(200)
					.end(function(manageAppSaveErr, manageAppSaveRes) {
						// Handle Manage app save error
						if (manageAppSaveErr) done(manageAppSaveErr);

						// Delete existing Manage app
						agent.delete('/api/manage-apps/' + manageAppSaveRes.body._id)
							.send(manageApp)
							.expect(200)
							.end(function(manageAppDeleteErr, manageAppDeleteRes) {
								// Handle Manage app error error
								if (manageAppDeleteErr) done(manageAppDeleteErr);

								// Set assertions
								(manageAppDeleteRes.body._id).should.equal(manageAppSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Manage app instance if not signed in', function(done) {
		// Set Manage app user 
		manageApp.user = user;

		// Create new Manage app model instance
		var manageAppObj = new ManageApp(manageApp);

		// Save the Manage app
		manageAppObj.save(function() {
			// Try deleting Manage app
			request(app).delete('/api/manage-apps/' + manageAppObj._id)
			.expect(403)
			.end(function(manageAppDeleteErr, manageAppDeleteRes) {
				// Set message assertion
				(manageAppDeleteRes.body.message).should.match('User is not authorized');

				// Handle Manage app error error
				done(manageAppDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			ManageApp.remove().exec(function(){
				done();
			});
		});
	});
});
