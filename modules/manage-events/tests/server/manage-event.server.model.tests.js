'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ManageEvent = mongoose.model('ManageEvent');

/**
 * Globals
 */
var user, manageEvent;

/**
 * Unit tests
 */
describe('Manage event Model Unit Tests:', function() {
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
			manageEvent = new ManageEvent({
				name: 'Manage event Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return manageEvent.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			manageEvent.name = '';

			return manageEvent.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ManageEvent.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
