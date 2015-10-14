'use strict';

//Articles service used for communicating with the maps REST endpoints
angular.module('maps').factory('Maps', ['$resource',
  function ($resource) {
    return $resource('api/maps/:eventId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
