'use strict';

// Pending events controller
angular.module('pending-events').controller('PendingEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PendingEvents',
	function($scope, $stateParams, $location, Authentication, PendingEvents ) {
		$scope.authentication = Authentication;

		// Create new Pending event
		$scope.create = function() {
			// Create new Pending event object
			var pendingEvent = new PendingEvents ({
				name: this.name
			});

			// Redirect after save
			pendingEvent.$save(function(response) {
				$location.path('pending-events/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pending event
		$scope.remove = function( pendingEvent ) {
			if ( pendingEvent ) { pendingEvent.$remove();

				for (var i in $scope.pendingEvents ) {
					if ($scope.pendingEvents [i] === pendingEvent ) {
						$scope.pendingEvents.splice(i, 1);
					}
				}
			} else {
				$scope.pendingEvent.$remove(function() {
					$location.path('pending-events');
				});
			}
		};

		// Update existing Pending event
		$scope.update = function() {
			var pendingEvent = $scope.pendingEvent ;

			pendingEvent.$update(function() {
				$location.path('pending-events/' + pendingEvent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pending events
		$scope.find = function() {
			$scope.pendingEvents = PendingEvents.query();
		};

		// Find existing Pending event
		$scope.findOne = function() {
			$scope.pendingEvent = PendingEvents.get({ 
				pendingEventId: $stateParams.pendingEventId
			});
		};
	}
]);