'use strict';

describe('Maps E2E Tests:', function () {
  describe('Test articles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/maps');
      expect(element.all(by.repeater('event in maps')).count()).toEqual(0);
    });
  });
});
