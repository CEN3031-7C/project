'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ManageContact = mongoose.model('ManageContact'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, manageContact;

/**
 * Manage contact routes tests
 */
describe('Manage contact CRUD tests', function() {
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

		// Save a user to the test db and create new Manage contact
		user.save(function() {
			manageContact = {
				name: 'Manage contact Name'
			};

			done();
		});
	});

	it('should be able to save Manage contact instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage contact
				agent.post('/api/manage-contacts')
					.send(manageContact)
					.expect(200)
					.end(function(manageContactSaveErr, manageContactSaveRes) {
						// Handle Manage contact save error
						if (manageContactSaveErr) done(manageContactSaveErr);

						// Get a list of Manage contacts
						agent.get('/api/manage-contacts')
							.end(function(manageContactsGetErr, manageContactsGetRes) {
								// Handle Manage contact save error
								if (manageContactsGetErr) done(manageContactsGetErr);

								// Get Manage contacts list
								var manageContacts = manageContactsGetRes.body;

								// Set assertions
								(manageContacts[0].user._id).should.equal(userId);
								(manageContacts[0].name).should.match('Manage contact Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Manage contact instance if not logged in', function(done) {
		agent.post('/api/manage-contacts')
			.send(manageContact)
			.expect(403)
			.end(function(manageContactSaveErr, manageContactSaveRes) {
				// Call the assertion callback
				done(manageContactSaveErr);
			});
	});

	it('should not be able to save Manage contact instance if no name is provided', function(done) {
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

				// Save a new Manage contact
				agent.post('/api/manage-contacts')
					.send(manageContact)
					.expect(400)
					.end(function(manageContactSaveErr, manageContactSaveRes) {
						// Set message assertion
						(manageContactSaveRes.body.message).should.match('Please fill Manage contact name');
						
						// Handle Manage contact save error
						done(manageContactSaveErr);
					});
			});
	});

	it('should be able to update Manage contact instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage contact
				agent.post('/api/manage-contacts')
					.send(manageContact)
					.expect(200)
					.end(function(manageContactSaveErr, manageContactSaveRes) {
						// Handle Manage contact save error
						if (manageContactSaveErr) done(manageContactSaveErr);

						// Update Manage contact name
						manageContact.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Manage contact
						agent.put('/api/manage-contacts/' + manageContactSaveRes.body._id)
							.send(manageContact)
							.expect(200)
							.end(function(manageContactUpdateErr, manageContactUpdateRes) {
								// Handle Manage contact update error
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

	it('should be able to get a list of Manage contacts if not signed in', function(done) {
		// Create new Manage contact model instance
		var manageContactObj = new ManageContact(manageContact);

		// Save the Manage contact
		manageContactObj.save(function() {
			// Request Manage contacts
			request(app).get('/api/manage-contacts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Manage contact if not signed in', function(done) {
		// Create new Manage contact model instance
		var manageContactObj = new ManageContact(manageContact);

		// Save the Manage contact
		manageContactObj.save(function() {
			request(app).get('/api/manage-contacts/' + manageContactObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', manageContact.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Manage contact instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Manage contact
				agent.post('/api/manage-contacts')
					.send(manageContact)
					.expect(200)
					.end(function(manageContactSaveErr, manageContactSaveRes) {
						// Handle Manage contact save error
						if (manageContactSaveErr) done(manageContactSaveErr);

						// Delete existing Manage contact
						agent.delete('/api/manage-contacts/' + manageContactSaveRes.body._id)
							.send(manageContact)
							.expect(200)
							.end(function(manageContactDeleteErr, manageContactDeleteRes) {
								// Handle Manage contact error error
								if (manageContactDeleteErr) done(manageContactDeleteErr);

								// Set assertions
								(manageContactDeleteRes.body._id).should.equal(manageContactSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Manage contact instance if not signed in', function(done) {
		// Set Manage contact user 
		manageContact.user = user;

		// Create new Manage contact model instance
		var manageContactObj = new ManageContact(manageContact);

		// Save the Manage contact
		manageContactObj.save(function() {
			// Try deleting Manage contact
			request(app).delete('/api/manage-contacts/' + manageContactObj._id)
			.expect(403)
			.end(function(manageContactDeleteErr, manageContactDeleteRes) {
				// Set message assertion
				(manageContactDeleteRes.body.message).should.match('User is not authorized');

				// Handle Manage contact error error
				done(manageContactDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			ManageContact.remove().exec(function(){
				done();
			});
		});
	});
});
