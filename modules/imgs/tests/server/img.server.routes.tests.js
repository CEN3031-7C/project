'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Img = mongoose.model('Img'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, img;

/**
 * Img routes tests
 */
describe('Img CRUD tests', function() {
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

		// Save a user to the test db and create new Img
		user.save(function() {
			img = {
				name: 'Img Name'
			};

			done();
		});
	});

	it('should be able to save Img instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Img
				agent.post('/api/imgs')
					.send(img)
					.expect(200)
					.end(function(imgSaveErr, imgSaveRes) {
						// Handle Img save error
						if (imgSaveErr) done(imgSaveErr);

						// Get a list of Imgs
						agent.get('/api/imgs')
							.end(function(imgsGetErr, imgsGetRes) {
								// Handle Img save error
								if (imgsGetErr) done(imgsGetErr);

								// Get Imgs list
								var imgs = imgsGetRes.body;

								// Set assertions
								(imgs[0].user._id).should.equal(userId);
								(imgs[0].name).should.match('Img Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Img instance if not logged in', function(done) {
		agent.post('/api/imgs')
			.send(img)
			.expect(403)
			.end(function(imgSaveErr, imgSaveRes) {
				// Call the assertion callback
				done(imgSaveErr);
			});
	});

	it('should not be able to save Img instance if no name is provided', function(done) {
		// Invalidate name field
		img.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Img
				agent.post('/api/imgs')
					.send(img)
					.expect(400)
					.end(function(imgSaveErr, imgSaveRes) {
						// Set message assertion
						(imgSaveRes.body.message).should.match('Please fill Img name');
						
						// Handle Img save error
						done(imgSaveErr);
					});
			});
	});

	it('should be able to update Img instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Img
				agent.post('/api/imgs')
					.send(img)
					.expect(200)
					.end(function(imgSaveErr, imgSaveRes) {
						// Handle Img save error
						if (imgSaveErr) done(imgSaveErr);

						// Update Img name
						img.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Img
						agent.put('/api/imgs/' + imgSaveRes.body._id)
							.send(img)
							.expect(200)
							.end(function(imgUpdateErr, imgUpdateRes) {
								// Handle Img update error
								if (imgUpdateErr) done(imgUpdateErr);

								// Set assertions
								(imgUpdateRes.body._id).should.equal(imgSaveRes.body._id);
								(imgUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Imgs if not signed in', function(done) {
		// Create new Img model instance
		var imgObj = new Img(img);

		// Save the Img
		imgObj.save(function() {
			// Request Imgs
			request(app).get('/api/imgs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Img if not signed in', function(done) {
		// Create new Img model instance
		var imgObj = new Img(img);

		// Save the Img
		imgObj.save(function() {
			request(app).get('/api/imgs/' + imgObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', img.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Img instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Img
				agent.post('/api/imgs')
					.send(img)
					.expect(200)
					.end(function(imgSaveErr, imgSaveRes) {
						// Handle Img save error
						if (imgSaveErr) done(imgSaveErr);

						// Delete existing Img
						agent.delete('/api/imgs/' + imgSaveRes.body._id)
							.send(img)
							.expect(200)
							.end(function(imgDeleteErr, imgDeleteRes) {
								// Handle Img error error
								if (imgDeleteErr) done(imgDeleteErr);

								// Set assertions
								(imgDeleteRes.body._id).should.equal(imgSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Img instance if not signed in', function(done) {
		// Set Img user 
		img.user = user;

		// Create new Img model instance
		var imgObj = new Img(img);

		// Save the Img
		imgObj.save(function() {
			// Try deleting Img
			request(app).delete('/api/imgs/' + imgObj._id)
			.expect(403)
			.end(function(imgDeleteErr, imgDeleteRes) {
				// Set message assertion
				(imgDeleteRes.body.message).should.match('User is not authorized');

				// Handle Img error error
				done(imgDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Img.remove().exec(function(){
				done();
			});
		});
	});
});
