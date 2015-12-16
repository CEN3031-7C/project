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
			browser.sleep(5000); //wait for the attempted redirect
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

			browser.sleep(5000);
			element.all(by.repeater('newsFeed in newsFeeds')).count().then(function (count) {
    			var currentCount = count;
    			console.log(count);
			});

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
     		console.log("Current Count + 1 is: ");
     		console.log(currentCount)
     		browser.sleep(5000);
     		expect(newsFeeds.count()).toEqual(currentCount);

		});

		it('Should be able to change the order of the news feed articles', function() {
			var currentFirst;
			currentFirst = element( by.repeater('newsFeed in newsFeeds').row(0).column('title'));

			sleep(1000);
			element.all(by.model('Down_Button')).get(0).click();
			sleep(1000);
			expect(element.all(by.repeater('newsFeed in newsFeeds')).get(0)).not
				.toBe(currentFirst);

			element.all(by.model('Up_Button')).get(1).click();
			sleep(1000);
			expect(element(by.repeater('newsFeed in newsFeeds')).row(0).column('title'))
				.toBe(currentFirst);
			sleep(1000);

		});
		it('Should be able to hide/show the event on the front page', function() {
			browser.get('http://localhost:3000/');
			browser.sleep(3000);

			var currentCount = 4;

			newsFeeds.count().then(function (count) {
    			currentCount = count;
    			console.log(count);
			});

			browser.get('http://localhost:3000/admin/news-feed');
			element.all(by.model('Hide_Button')).get(0).click();
			browser.sleep(1000);

			console.log("First Expect!");

			browser.get('http://localhost:3000/');
			browser.sleep(5000);
			expect(element.all(by.repeater('newsFeed in newsFeeds')).count()).toBe(currentCount - 1);

			browser.sleep(1000);
			browser.get('http://localhost:3000/admin/news-feed');
			element.all(by.model('Show_Button')).get(0).click();

			console.log("Second Expect!");

			browser.sleep(1000);
			browser.get('http://localhost:3000/');
			browser.sleep(5000);
			expect(element.all(by.repeater('newsFeed in newsFeeds')).count()).toBe(currentCount);


		});
		it('Should be able to edit the event information', function() {

		});
		it('Should be able to delete the event', function() {

		});
	});
});
