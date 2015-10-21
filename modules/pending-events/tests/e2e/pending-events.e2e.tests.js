'use strict';

describe('Pending events E2E Tests:', function() {
	describe('Test Pending events page', function() {
		it('Should not include new Pending events', function() {
			browser.get('http://localhost:3000/#!/pending-events');
			expect(element.all(by.repeater('pendingEvent in pendingEvents')).count()).toEqual(0);
		});
	});
});
