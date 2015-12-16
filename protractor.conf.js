'use strict';

// Protractor configuration
exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',
  suites: {
    all: ['modules/*/tests/e2e/*.js'],
    users: ['modules/users/tests/e2e/users.e2e.tests.js'],
    news_feeds: ['modules/news-feeds/tests/e2e/news-feeds.e2e.tests.js'],
    manage_events: ['modules/manage-events/tests/e2e/manage-events.e2e.tests.js'],
    contacts: ['modules/manage-contacts/tests/e2e/manage-contacts.e2e.tests.js'],
    apps: ['modules/manage-apps/tests/e2e/manage-apps.e2e.tests.js'],
    imgs: ['modules/imgs/tests/e2e/imgs.e2e.tests.js'],
    core: ['modules/core/tests/e2e/coree2etest.js'] //Not implemented yet, woops
  },
  //specs: ['modules/*/tests/e2e/*.js']
  allScriptsTimeout: 20000,

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
  	showColors: true,
  	defaultTimeoutInterval: 100000,
 	isVerbose: true
  }
};

