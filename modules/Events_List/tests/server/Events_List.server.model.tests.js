'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Events_List = mongoose.model('Events_List');

/**
 * Globals
 */
var user, Events_List;

/**
 * Unit tests
 */
describe('Events_List Model Unit Tests:', function() {
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
			Events_List = new Events_List({
				name: 'Events_List Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return Events_List.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			Events_List.name = '';

			return Events_List.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Events_List.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
