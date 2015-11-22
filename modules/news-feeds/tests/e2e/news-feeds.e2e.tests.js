'use strict';

describe('News feeds E2E Tests:', function() {
	describe('Test News feeds page', function() {
		it('Should not include new News feeds', function() {
			browser.get('http://localhost:3000/#!/news-feeds');
			expect(element.all(by.repeater('newsFeed in newsFeeds')).count()).toEqual(0);
		});
	});
});
