'use strict';

describe('Manage events E2E Tests:', function() {
	describe('Test Manage events page', function() {
		it('Should not include new Manage events', function() {
			browser.get('http://localhost:3000/#!/manage-events');
			expect(element.all(by.repeater('manageEvent in manageEvents')).count()).toEqual(0);
		});
	});
});
