'use strict';

describe('Imgs E2E Tests:', function() {
	describe('Test Imgs page', function() {
		it('Should not include new Imgs', function() {
			browser.get('http://localhost:3000/#!/imgs');
			expect(element.all(by.repeater('img in imgs')).count()).toEqual(0);
		});
	});
});
