'use strict';

describe('News feeds E2E Tests:', function() {
	describe('Test News feeds page', function() {
		var newsFeeds = element.all(by.repeater('newsFeed in newsFeeds'));

		it('Should not include new News feeds', function() {
			browser.get('http://localhost:3000/#!/news-feeds');
			expect(element.all(by.repeater('newsFeed in newsFeeds')).count()).toEqual(0);
		});
		it('Should only be accessible by the admin', function() {
			browser.get('http://localhost:3000/admin/news-feed');
			//browser.sleep(5000); //wait for the attempted redirect
			expect(browser.getLocationAbsUrl()).not
    			.toBe('http://localhost:3000/admin/news-feed'); //make sure we weren't allowed to go here.

    			//----  Begin Login to Admin account --------
    			browser.get('http://localhost:3000/authentication/signin');
     			element(by.model('credentials.username')).sendKeys("admin");
      			element(by.model('credentials.password')).sendKeys("P@ssword10");
      			element(by.css('button[type=submit]')).click();
      			browser.sleep(5000);
      			browser.get('http://localhost:3000/admin/news-feed');
      			//----  end Login to Admin Account
      		expect(browser.getLocationAbsUrl())
    			.toBe('/admin/news-feed'); //this time, we should be able to go here!
		});

		it('Should be able to add a new item', function() {

			//browser.sleep(5000);
			element.all(by.repeater('newsFeed in newsFeeds')).count().then(function (count) {
    			var currentCount = count;

    			element(by.model('New_Article_Button')).click();
				//browser.refresh();
				browser.sleep(5000);
				expect(browser.getLocationAbsUrl())
	    			.toBe('/admin/news-feed/create');

	    		element(by.model('Submit_Button')).click();
	     		element(by.binding('error')).getText().then(function (errorText) {
	        		expect(errorText).toBe('Please fill News feed name');
	        	});

	     		element(by.model('title')).sendKeys("Protractor Test News Feed");
	     		element(by.model('Submit_Button')).click();
	     		//browser.refresh();
	     		currentCount++;
	     		browser.sleep(5000);
	     		expect(newsFeeds.count()).toEqual(currentCount);
			});
		});

		it('Should be able to change the order of the news feed articles', function() {
			var currentFirst;
			//element.all(by.repeater('newsFeed in newsFeeds')).get(0).all(by.tagName('div')).get(1).element(by.model('NewsFeed_Title')).getText()
    		//					.then( function(text){
    		//element(by.repeater('newsFeed in newsFeeds').
    							//row(0).column('newsFeed.title')).getText().then(function(text){
    		element.all(by.model('NewsFeed_Title')).getText().then(function(text) {

    			if(text[0] == '')
    				currentFirst = text[1];
    			else
    				currentFirst = text[0];

    			//console.log(currentFirst);
    			browser.sleep(1000);
				element.all(by.model('Down_Button')).get(0).click();
				browser.sleep(1000);
				//expect(element(by.repeater('newsFeed in newsFeeds').row(0).column('title')).getText()[1]).not
				//	.toBe(currentFirst);
				expect(element.all(by.model('NewsFeed_Title')).get(1).getText()).not.toBe(currentFirst);

				element.all(by.model('Up_Button')).get(1).click();
				browser.sleep(1000);
				//expect(element(by.repeater('newsFeed in newsFeeds').row(0).column('title')).getText()[1])
				//	.toBe(currentFirst);
				expect(element.all(by.model('NewsFeed_Title')).get(1).getText()).toBe(currentFirst);
				browser.sleep(1000);
    		});
		});
		it('Should be able to hide/show the event on the front page', function() {
			//browser.get('http://localhost:3000/');
			//browser.sleep(3000);

			var currentCount = 4;

			newsFeeds.count().then(function (count) {
    			currentCount = count;
    			browser.get('http://localhost:3000/admin/news-feed');
				element.all(by.model('Hide_Button')).get(0).click();

				browser.get('http://localhost:3000/');
				expect(element.all(by.repeater('newsFeed in newsFeeds')).count()).toBe(currentCount);

				browser.get('http://localhost:3000/admin/news-feed');
				element.all(by.model('Show_Button')).get(0).click();

				browser.get('http://localhost:3000/');
				expect(element.all(by.repeater('newsFeed in newsFeeds')).count()).toBe(currentCount);
			});

		});
		it('Should be able to edit the event information', function() {
			browser.get('http://localhost:3000/admin/news-feed');
			browser.sleep(1000);
			var currentFirst;
		
    		element.all(by.model('NewsFeed_Title')).getText().then(function(text) {

    			if(text[0] == '')
    				currentFirst = text[1];
    			else
    				currentFirst = text[0];

				element.all(by.model('Edit_Button')).get(0).click();
				browser.sleep(7000);
				
				element(by.model('newsFeed.title')).sendKeys("Protractor Test Edited Name");
				browser.sleep(1000);
				element(by.model('Update_Button')).click();
				browser.sleep(8000);

				browser.get('http://localhost:3000/admin/news-feed');
				browser.sleep(3000);

				expect(element.all(by.model('NewsFeed_Title')).get(1).getText()).not.toBe(currentFirst);
				browser.sleep(1000);
    		});
		});
		it('Should be able to delete the event', function() {
			browser.get('http://localhost:3000/admin/news-feed');
			browser.sleep(1000);
			var currentCount = 4;

			newsFeeds.count().then(function (count) {
    			currentCount = count;
				element.all(by.model('Delete_Button')).get(0).click();
				browser.sleep(500);
				expect(element.all(by.repeater('newsFeed in newsFeeds')).count()).toBe(currentCount - 1);
			});
		});
	});
});
