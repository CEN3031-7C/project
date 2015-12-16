'use strict';

// Protractor configuration
exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',
  suites: {
    all: ['modules/*/tests/e2e/*.js'],
    users: ['modules/users/tests/e2e/users.e2e.tests.js'],
    news_feeds: ['modules/news-feeds/tests/e2e/news-feeds.e2e.tests.js']
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

