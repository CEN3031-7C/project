'use strict';

describe('Feedbacks E2E Tests:', function() {
	describe('Test Feedbacks page', function() {
		it('Should not include new Feedbacks', function() {
			browser.get('http://localhost:3000/#!/feedbacks');
			expect(element.all(by.repeater('feedback in feedbacks')).count()).toEqual(0);
		});
	});
});
