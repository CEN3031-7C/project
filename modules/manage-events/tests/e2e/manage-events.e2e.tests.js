'use strict';

describe('Manage Events E2E Tests:', function() {
	describe('Manage Events page', function() {
		var manageEvents = element.all(by.repeater('manageEvent in manageEvents'));
		var currentCount = 0;


		it('Should not include new Manage events', function() {
			browser.get('http://localhost:3000/#!/manage-events');
			expect(element.all(by.repeater('manageEvent in manageEvents')).count()).toEqual(0);
		});
		it('Should only be accessible by the admin', function() {
			browser.get('http://localhost:3000/admin/manage-events');
			//browser.sleep(5000); //wait for the attempted redirect
			expect(browser.getLocationAbsUrl()).not
    			.toBe('http://localhost:3000/admin/manage-events'); //make sure we weren't allowed to go here.

    			//----  Begin Login to Admin account --------
    			browser.get('http://localhost:3000/authentication/signin');
     			element(by.model('credentials.username')).sendKeys("admin");
      			element(by.model('credentials.password')).sendKeys("P@ssword10");
      			element(by.css('button[type=submit]')).click();
      			browser.sleep(5000);
      			browser.get('http://localhost:3000/admin/manage-events');
      			//----  end Login to Admin Account
      		expect(browser.getLocationAbsUrl())
    			.toBe('/admin/manage-events'); //this time, we should be able to go here!
		});

		it('Should be able to add a new item', function() {

			//browser.sleep(5000);
			element.all(by.repeater('manageEvent in manageEvents')).count().then(function (count) {
    			currentCount = count;

    			element(by.model('New_Article_Button')).click();
				//browser.refresh();
				browser.sleep(5000);
				expect(browser.getLocationAbsUrl())
	    			.toBe('/admin/manage-events/create');

	    		element(by.model('Submit_Button')).click();
	     		element(by.binding('error')).getText().then(function (errorText) {
	        		expect(errorText).toBe('Please fill event name');
	        	});

	     		element(by.model('name')).sendKeys("Protractor Test Event");
	     		//element(by.model('manageEvent.date')).sendKeys("1 December 2016");
	     		element(by.model('Submit_Button')).click();
	     		//browser.refresh();
	     		currentCount++;
	     		browser.sleep(5000);
	     		expect(manageEvents.count()).toEqual(currentCount);
			});
		});
		it('Should be able to hide/show the event on the public event page', function() {
			browser.get('http://localhost:3000/');
			browser.sleep(3000);

			//var currentCount = 4;

			manageEvents.count().then(function (count) {
    			
    			//currentCount = count;
    			browser.get('http://localhost:3000/admin/manage-events');
				element.all(by.model('Hide_Button')).get(0).click();

				browser.get('http://localhost:3000/calendars/eventsList');
				expect(element.all(by.repeater('manageEvent in manageEvents')).count()).toBe(currentCount);

				browser.sleep(5000);

				browser.get('http://localhost:3000/admin/manage-events');
				element.all(by.model('Show_Button')).get(0).click();

				browser.get('http://localhost:3000/calendars/eventsList');
				expect(element.all(by.repeater('manageEvent in manageEvents')).count()).toBe(currentCount);

				browser.sleep(5000);
			});

		});
		it('Should be able to edit the event information', function() {
			browser.get('http://localhost:3000/admin/manage-events');
			browser.sleep(1000);
			var currentFirst;
		
    		element.all(by.model('ManageEvents_Title')).getText().then(function(text) {

    			if(text[0] == '')
    				currentFirst = text[1];
    			else
    				currentFirst = text[0];

				element.all(by.model('Edit_Button')).get(currentCount - 1).click();
				browser.sleep(7000);
				
				element(by.model('manageEvent.name')).sendKeys("Protractor Test Edited Name");
				browser.sleep(1000);
				element(by.model('Update_Button')).click();
				browser.sleep(8000);

				browser.get('http://localhost:3000/admin/manage-events');
				browser.sleep(3000);

				expect(element.all(by.model('ManageEvents_Title')).get(currentCount - 1).getText()).not.toBe(currentFirst);
				browser.sleep(1000);
    		});
		});
		it('Should be able to delete the event', function() {
			browser.get('http://localhost:3000/admin/manage-events');
			browser.sleep(1000);

			manageEvents.count().then(function (count) {
    			//currentCount = count;
				element.all(by.model('Delete_Button')).get(currentCount - 1).click();
				browser.sleep(500);
				expect(element.all(by.repeater('manageEvent in manageEvents')).count()).toBe(currentCount - 1);
			});

		});
	});
});
