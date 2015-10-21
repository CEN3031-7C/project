'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PendingEvent = mongoose.model('PendingEvent');

/**
 * Globals
 */
var user, pendingEvent;

/**
 * Unit tests
 */
describe('Pending event Model Unit Tests:', function() {
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
			pendingEvent = new PendingEvent({
				name: 'Pending event Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return pendingEvent.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			pendingEvent.name = '';

			return pendingEvent.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		PendingEvent.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
