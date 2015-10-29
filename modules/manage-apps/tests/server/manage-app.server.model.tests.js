'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ManageApp = mongoose.model('ManageApp');

/**
 * Globals
 */
var user, manageApp;

/**
 * Unit tests
 */
describe('Manage app Model Unit Tests:', function() {
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
			manageApp = new ManageApp({
				name: 'Manage app Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return manageApp.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			manageApp.name = '';

			return manageApp.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ManageApp.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
