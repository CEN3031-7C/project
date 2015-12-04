'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ManageContact = mongoose.model('ManageContact');

/**
 * Globals
 */
var user, manageContact;

/**
 * Unit tests
 */
describe('Manage contact Model Unit Tests:', function() {
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
			manageContact = new ManageContact({
				name: 'Manage contact Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return manageContact.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			manageContact.name = '';

			return manageContact.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ManageContact.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
