'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Feedback = mongoose.model('Feedback'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, feedback;

/**
 * Feedback routes tests
 */
describe('Feedback CRUD tests', function() {
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

		// Save a user to the test db and create new Feedback
		user.save(function() {
			feedback = {
				name: 'Feedback Name'
			};

			done();
		});
	});

	it('should be able to save Feedback instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feedback
				agent.post('/api/feedbacks')
					.send(feedback)
					.expect(200)
					.end(function(feedbackSaveErr, feedbackSaveRes) {
						// Handle Feedback save error
						if (feedbackSaveErr) done(feedbackSaveErr);

						// Get a list of Feedbacks
						agent.get('/api/feedbacks')
							.end(function(feedbacksGetErr, feedbacksGetRes) {
								// Handle Feedback save error
								if (feedbacksGetErr) done(feedbacksGetErr);

								// Get Feedbacks list
								var feedbacks = feedbacksGetRes.body;

								// Set assertions
								(feedbacks[0].user._id).should.equal(userId);
								(feedbacks[0].name).should.match('Feedback Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Feedback instance if not logged in', function(done) {
		agent.post('/api/feedbacks')
			.send(feedback)
			.expect(403)
			.end(function(feedbackSaveErr, feedbackSaveRes) {
				// Call the assertion callback
				done(feedbackSaveErr);
			});
	});

	it('should not be able to save Feedback instance if no name is provided', function(done) {
		// Invalidate name field
		feedback.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feedback
				agent.post('/api/feedbacks')
					.send(feedback)
					.expect(400)
					.end(function(feedbackSaveErr, feedbackSaveRes) {
						// Set message assertion
						(feedbackSaveRes.body.message).should.match('Please fill Feedback name');
						
						// Handle Feedback save error
						done(feedbackSaveErr);
					});
			});
	});

	it('should be able to update Feedback instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feedback
				agent.post('/api/feedbacks')
					.send(feedback)
					.expect(200)
					.end(function(feedbackSaveErr, feedbackSaveRes) {
						// Handle Feedback save error
						if (feedbackSaveErr) done(feedbackSaveErr);

						// Update Feedback name
						feedback.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Feedback
						agent.put('/api/feedbacks/' + feedbackSaveRes.body._id)
							.send(feedback)
							.expect(200)
							.end(function(feedbackUpdateErr, feedbackUpdateRes) {
								// Handle Feedback update error
								if (feedbackUpdateErr) done(feedbackUpdateErr);

								// Set assertions
								(feedbackUpdateRes.body._id).should.equal(feedbackSaveRes.body._id);
								(feedbackUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Feedbacks if not signed in', function(done) {
		// Create new Feedback model instance
		var feedbackObj = new Feedback(feedback);

		// Save the Feedback
		feedbackObj.save(function() {
			// Request Feedbacks
			request(app).get('/api/feedbacks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Feedback if not signed in', function(done) {
		// Create new Feedback model instance
		var feedbackObj = new Feedback(feedback);

		// Save the Feedback
		feedbackObj.save(function() {
			request(app).get('/api/feedbacks/' + feedbackObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', feedback.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Feedback instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feedback
				agent.post('/api/feedbacks')
					.send(feedback)
					.expect(200)
					.end(function(feedbackSaveErr, feedbackSaveRes) {
						// Handle Feedback save error
						if (feedbackSaveErr) done(feedbackSaveErr);

						// Delete existing Feedback
						agent.delete('/api/feedbacks/' + feedbackSaveRes.body._id)
							.send(feedback)
							.expect(200)
							.end(function(feedbackDeleteErr, feedbackDeleteRes) {
								// Handle Feedback error error
								if (feedbackDeleteErr) done(feedbackDeleteErr);

								// Set assertions
								(feedbackDeleteRes.body._id).should.equal(feedbackSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Feedback instance if not signed in', function(done) {
		// Set Feedback user 
		feedback.user = user;

		// Create new Feedback model instance
		var feedbackObj = new Feedback(feedback);

		// Save the Feedback
		feedbackObj.save(function() {
			// Try deleting Feedback
			request(app).delete('/api/feedbacks/' + feedbackObj._id)
			.expect(403)
			.end(function(feedbackDeleteErr, feedbackDeleteRes) {
				// Set message assertion
				(feedbackDeleteRes.body.message).should.match('User is not authorized');

				// Handle Feedback error error
				done(feedbackDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Feedback.remove().exec(function(){
				done();
			});
		});
	});
});
