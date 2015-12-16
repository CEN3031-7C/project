'use strict';

describe('Users E2E Tests:', function () {
	var topbar = element.all(by.repeater('item in menu.items'));

  describe('Signin Validation', function () {
    it('Should report invalid credentials', function () {
      browser.get('http://localhost:3000/authentication/signin');
      //browser.get('http://team7capp.herokuapp.com/authentication/signin')
      element(by.model('credentials.username')).sendKeys("Hi!");
      element(by.model('credentials.password')).sendKeys("hi");
      browser.sleep(1000);
      element(by.css('button[type=submit]')).click();
      element(by.binding('error')).getText().then(function (errorText) {
        expect(errorText).toBe('Invalid username or password');
      });
    });
    it('Should redirect to Facebook when the button is pressed', function(){
    	element(by.binding('FBButton')).click();
    	browser.sleep(15000); //Gives us time to log in to Facebook in case we don't have cookies
    	expect(browser.getLocationAbsUrl()).not
    		.toBe('http://localhost:3000/authentication/signin');

    	//element(by.model('signout_button')).click();
    	browser.get('http://localhost:3000/api/auth/signout'); //We sign out for future tests
    	browser.sleep(6000);

    });
    it('Should be able to log in with the default user', function () {
      browser.get('http://localhost:3000/authentication/signin');
      element(by.model('credentials.username')).sendKeys("user");
      element(by.model('credentials.password')).sendKeys("P@ssword10");
      browser.sleep(1000);
      element(by.css('button[type=submit]')).click();
      browser.sleep(3000);
      expect(browser.getLocationAbsUrl())
    	.toBe('/'); //We check to make sure we were redirected to the home page as expected
      expect(topbar.count()).toEqual(2); //We make sure that, as a normal user, we don't have any admin powers
      browser.get('http://localhost:3000/api/auth/signout'); //We sign out for future tests
    	browser.sleep(6000);
    });
  });
});

describe('Admin E2E Tests:', function () {
	var topbar = element.all(by.repeater('item in menu.items'));


  describe('Signin Validation', function () {
    it('Should be able to log in with the default admin', function () {

 	  //var topbar = element.all(by.repeater('item in menu.items'));

      browser.get('http://localhost:3000/authentication/signin');
      element(by.model('credentials.username')).sendKeys("admin");
      element(by.model('credentials.password')).sendKeys("P@ssword10");
      browser.sleep(1000);
      element(by.css('button[type=submit]')).click();
      browser.sleep(3000);
  
      expect(topbar.count()).toEqual(3); //We check to make sure the admin options are available now.
    });
  });
});