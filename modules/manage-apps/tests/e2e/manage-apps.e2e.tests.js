'use strict';

describe('Manage apps E2E Tests:', function() {
	describe('Test Manage apps page', function() {
		it('Should not include new Manage apps', function() {
			browser.get('http://localhost:3000/#!/manage-apps');
			expect(element.all(by.repeater('manageApp in manageApps')).count()).toEqual(0);
		});
	});
});
