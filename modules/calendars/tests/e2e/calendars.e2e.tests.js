'use strict';

describe('Calendars E2E Tests:', function() {
	describe('Test Calendars page', function() {
		it('Should not include new Calendars', function() {
			browser.get('http://localhost:3000/#!/calendars');
			expect(element.all(by.repeater('calendar in calendars')).count()).toEqual(0);
		});
	});
});
