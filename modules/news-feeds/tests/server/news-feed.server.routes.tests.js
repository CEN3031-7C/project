'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	NewsFeed = mongoose.model('NewsFeed'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, newsFeed;

/**
 * News feed routes tests
 */
describe('News feed CRUD tests', function() {
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

		// Save a user to the test db and create new News feed
		user.save(function() {
			newsFeed = {
				name: 'News feed Name'
			};

			done();
		});
	});

	it('should be able to save News feed instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new News feed
				agent.post('/api/news-feeds')
					.send(newsFeed)
					.expect(200)
					.end(function(newsFeedSaveErr, newsFeedSaveRes) {
						// Handle News feed save error
						if (newsFeedSaveErr) done(newsFeedSaveErr);

						// Get a list of News feeds
						agent.get('/api/news-feeds')
							.end(function(newsFeedsGetErr, newsFeedsGetRes) {
								// Handle News feed save error
								if (newsFeedsGetErr) done(newsFeedsGetErr);

								// Get News feeds list
								var newsFeeds = newsFeedsGetRes.body;

								// Set assertions
								(newsFeeds[0].user._id).should.equal(userId);
								(newsFeeds[0].name).should.match('News feed Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save News feed instance if not logged in', function(done) {
		agent.post('/api/news-feeds')
			.send(newsFeed)
			.expect(403)
			.end(function(newsFeedSaveErr, newsFeedSaveRes) {
				// Call the assertion callback
				done(newsFeedSaveErr);
			});
	});

	it('should not be able to save News feed instance if no name is provided', function(done) {
		// Invalidate name field
		newsFeed.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new News feed
				agent.post('/api/news-feeds')
					.send(newsFeed)
					.expect(400)
					.end(function(newsFeedSaveErr, newsFeedSaveRes) {
						// Set message assertion
						(newsFeedSaveRes.body.message).should.match('Please fill News feed name');
						
						// Handle News feed save error
						done(newsFeedSaveErr);
					});
			});
	});

	it('should be able to update News feed instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new News feed
				agent.post('/api/news-feeds')
					.send(newsFeed)
					.expect(200)
					.end(function(newsFeedSaveErr, newsFeedSaveRes) {
						// Handle News feed save error
						if (newsFeedSaveErr) done(newsFeedSaveErr);

						// Update News feed name
						newsFeed.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing News feed
						agent.put('/api/news-feeds/' + newsFeedSaveRes.body._id)
							.send(newsFeed)
							.expect(200)
							.end(function(newsFeedUpdateErr, newsFeedUpdateRes) {
								// Handle News feed update error
								if (newsFeedUpdateErr) done(newsFeedUpdateErr);

								// Set assertions
								(newsFeedUpdateRes.body._id).should.equal(newsFeedSaveRes.body._id);
								(newsFeedUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of News feeds if not signed in', function(done) {
		// Create new News feed model instance
		var newsFeedObj = new NewsFeed(newsFeed);

		// Save the News feed
		newsFeedObj.save(function() {
			// Request News feeds
			request(app).get('/api/news-feeds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single News feed if not signed in', function(done) {
		// Create new News feed model instance
		var newsFeedObj = new NewsFeed(newsFeed);

		// Save the News feed
		newsFeedObj.save(function() {
			request(app).get('/api/news-feeds/' + newsFeedObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', newsFeed.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete News feed instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new News feed
				agent.post('/api/news-feeds')
					.send(newsFeed)
					.expect(200)
					.end(function(newsFeedSaveErr, newsFeedSaveRes) {
						// Handle News feed save error
						if (newsFeedSaveErr) done(newsFeedSaveErr);

						// Delete existing News feed
						agent.delete('/api/news-feeds/' + newsFeedSaveRes.body._id)
							.send(newsFeed)
							.expect(200)
							.end(function(newsFeedDeleteErr, newsFeedDeleteRes) {
								// Handle News feed error error
								if (newsFeedDeleteErr) done(newsFeedDeleteErr);

								// Set assertions
								(newsFeedDeleteRes.body._id).should.equal(newsFeedSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete News feed instance if not signed in', function(done) {
		// Set News feed user 
		newsFeed.user = user;

		// Create new News feed model instance
		var newsFeedObj = new NewsFeed(newsFeed);

		// Save the News feed
		newsFeedObj.save(function() {
			// Try deleting News feed
			request(app).delete('/api/news-feeds/' + newsFeedObj._id)
			.expect(403)
			.end(function(newsFeedDeleteErr, newsFeedDeleteRes) {
				// Set message assertion
				(newsFeedDeleteRes.body.message).should.match('User is not authorized');

				// Handle News feed error error
				done(newsFeedDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			NewsFeed.remove().exec(function(){
				done();
			});
		});
	});
});
