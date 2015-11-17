'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	NewsFeed = mongoose.model('NewsFeed');

/**
 * Globals
 */
var user, newsFeed;

/**
 * Unit tests
 */
describe('News feed Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			newsFeed = new NewsFeed({
				name: 'News feed Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return newsFeed.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			newsFeed.name = '';

			return newsFeed.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		NewsFeed.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
