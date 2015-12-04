'use strict';

describe('Manage contacts E2E Tests:', function() {
	describe('Test Manage contacts page', function() {
		it('Should not include new Manage contacts', function() {
			browser.get('http://localhost:3000/#!/manage-contacts');
			expect(element.all(by.repeater('manageContact in manageContacts')).count()).toEqual(0);
		});
	});
});
