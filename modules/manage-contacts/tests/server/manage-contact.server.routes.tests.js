'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	manageContact = mongoose.model('manageContact'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, manageContact;

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
			manageContact = {
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
					.send(manageContact)
					.expect(200)
					.end(function(manageContactSaveErr, manageContactSaveRes) {
						// Handle Manage app save error
						if (manageContactSaveErr) done(manageContactSaveErr);

						// Get a list of Manage apps
						agent.get('/api/manage-apps')
							.end(function(manageContactsGetErr, manageContactsGetRes) {
								// Handle Manage app save error
								if (manageContactsGetErr) done(manageContactsGetErr);

								// Get Manage apps list
								var manageContacts = manageContactsGetRes.body;

								// Set assertions
								(manageContacts[0].user._id).should.equal(userId);
								(manageContacts[0].name).should.match('Manage app Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Manage app instance if not logged in', function(done) {
		agent.post('/api/manage-apps')
			.send(manageContact)
			.expect(403)
			.end(function(manageContactSaveErr, manageContactSaveRes) {
				// Call the assertion callback
				done(manageContactSaveErr);
			});
	});

	it('should not be able to save Manage app instance if no name is provided', function(done) {
		// Invalidate name field
		manageContact.name = '';

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
					.send(manageContact)
					.expect(400)
					.end(function(manageContactSaveErr, manageContactSaveRes) {
						// Set message assertion
						(manageContactSaveRes.body.message).should.match('Please fill Manage app name');
						
						// Handle Manage app save error
						done(manageContactSaveErr);
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
					.send(manageContact)
					.expect(200)
					.end(function(manageContactSaveErr, manageContactSaveRes) {
						// Handle Manage app save error
						if (manageContactSaveErr) done(manageContactSaveErr);

						// Update Manage app name
						manageContact.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Manage app
						agent.put('/api/manage-apps/' + manageContactSaveRes.body._id)
							.send(manageContact)
							.expect(200)
							.end(function(manageContactUpdateErr, manageContactUpdateRes) {
								// Handle Manage app update error
								if (manageContactUpdateErr) done(manageContactUpdateErr);

								// Set assertions
								(manageContactUpdateRes.body._id).should.equal(manageContactSaveRes.body._id);
								(manageContactUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Manage apps if not signed in', function(done) {
		// Create new Manage app model instance
		var manageContactObj = new manageContact(manageContact);

		// Save the Manage app
		manageContactObj.save(function() {
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
		var manageContactObj = new manageContact(manageContact);

		// Save the Manage app
		manageContactObj.save(function() {
			request(app).get('/api/manage-apps/' + manageContactObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', manageContact.name);

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
					.send(manageContact)
					.expect(200)
					.end(function(manageContactSaveErr, manageContactSaveRes) {
						// Handle Manage app save error
						if (manageContactSaveErr) done(manageContactSaveErr);

						// Delete existing Manage app
						agent.delete('/api/manage-apps/' + manageContactSaveRes.body._id)
							.send(manageContact)
							.expect(200)
							.end(function(manageContactDeleteErr, manageContactDeleteRes) {
								// Handle Manage app error error
								if (manageContactDeleteErr) done(manageContactDeleteErr);

								// Set assertions
								(manageContactDeleteRes.body._id).should.equal(manageContactSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Manage app instance if not signed in', function(done) {
		// Set Manage app user 
		manageContact.user = user;

		// Create new Manage app model instance
		var manageContactObj = new manageContact(manageContact);

		// Save the Manage app
		manageContactObj.save(function() {
			// Try deleting Manage app
			request(app).delete('/api/manage-apps/' + manageContactObj._id)
			.expect(403)
			.end(function(manageContactDeleteErr, manageContactDeleteRes) {
				// Set message assertion
				(manageContactDeleteRes.body.message).should.match('User is not authorized');

				// Handle Manage app error error
				done(manageContactDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			manageContact.remove().exec(function(){
				done();
			});
		});
	});
});
