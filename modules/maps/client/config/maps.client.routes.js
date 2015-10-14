'use strict';

// Setting up route
angular.module('maps').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('maps', {
        abstract: true,
        url: '/maps',
        template: '<ui-view/>'
      })
      .state('maps.list', {
        url: '',
        templateUrl: 'modules/maps/client/views/list-maps.client.view.html'
      })
      .state('maps.create', {
        url: '/create',
        templateUrl: 'modules/maps/client/views/create-event.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('maps.view', {
        url: '/:eventId',
        templateUrl: 'modules/maps/client/views/view-event.client.view.html'
      })
      .state('maps.edit', {
        url: '/:eventId/edit',
        templateUrl: 'modules/maps/client/views/edit-event.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
