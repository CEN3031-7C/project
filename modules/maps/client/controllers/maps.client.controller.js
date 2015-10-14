'use strict';

// Maps controller
angular.module('maps').controller('MapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Maps',
  function ($scope, $stateParams, $location, Authentication, Maps) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'eventForm');

        return false;
      }

      // Create new Article object
      var event = new Maps({
        title: this.title,
        content: this.content,

        lon: this.long,
        lat: this.lat
      });

      // Redirect after save
      event.$save(function (response) {
        $location.path('maps/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';

        $scope.lon = 0;
        $scope.lat = 0;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.$on('mapInitialized', function(event,map) {
       var marker = map.markers[0];

       $scope.$watch('event.lat + event.lon',function(newVal,oldVal){
                    if(newVal === oldVal){return;}
                    // checks if value has changed 
       map.setCenter({lat:$scope.event.lat,lng:$scope.event.lon});
       marker.setPosition({lat:$scope.event.lat,lng:$scope.event.lon});
                  });
    });

    $scope.gotolink= function(event,i) {
      $location.path('maps/'+ i._id);
    };

    // Remove existing Article
    $scope.remove = function (event) {
      if (event) {
        event.$remove();

        for (var i in $scope.maps) {
          if ($scope.maps[i] === event) {
            $scope.maps.splice(i, 1);
          }
        }
      } else {
        $scope.event.$remove(function () {
          $location.path('maps');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'eventForm');

        return false;
      }

      var event = $scope.event;

      event.$update(function () {
        $location.path('maps/' + event._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Maps
    $scope.find = function () {
      $scope.maps = Maps.query();

      $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.event = Maps.get({
        eventId: $stateParams.eventId
      });
    };



    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

  }
]);
/*
angular.module('maps').config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCfsxDnK7heHQqY6_3hAW17s512VpjOKds'//    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});

angular.module('maps').controller("MapsController", function($scope, uiGmapGoogleMapApi) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {

    });
});
*/
