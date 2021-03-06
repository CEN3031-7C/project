'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      name: 'home',
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('home.contact', {
      url: 'contact',
      templateUrl: 'modules/core/client/views/contact.client.view.html',
    })
    .state('home.events', {
      url: 'events',
      templateUrl: 'modules/core/client/views/events.client.view.html',
    })
    .state('home.calendar', {
      url: 'calendar',
      templateUrl: 'modules/core/client/views/calendar.client.view.html',
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);
