'use strict';

describe('Events_List E2E Tests:', function() {
	describe('Test Events_List page', function() {
		it('Should not include new Events_List', function() {
			browser.get('http://localhost:3000/#!/Events_List');
			expect(element.all(by.repeater('Events_List in Events_List')).count()).toEqual(0);
		});
	});
});
