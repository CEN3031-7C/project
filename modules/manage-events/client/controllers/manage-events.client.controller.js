'use strict';

// Manage events controller
angular.module('manage-events').controller('ManageEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ManageEvents',
	function($scope, $stateParams, $location, Authentication, ManageEvents ) {
		$scope.authentication = Authentication;

		// Create new Manage event
		$scope.create = function() {
			// Create new Manage event object
			var manageEvent = new ManageEvents ({
				name: this.name
			});

			// Redirect after save
			manageEvent.$save(function(response) {
				$location.path('manage-events/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Manage event
		$scope.remove = function( manageEvent ) {
			if ( manageEvent ) { manageEvent.$remove();

				for (var i in $scope.manageEvents ) {
					if ($scope.manageEvents [i] === manageEvent ) {
						$scope.manageEvents.splice(i, 1);
					}
				}
			} else {
				$scope.manageEvent.$remove(function() {
					$location.path('manage-events');
				});
			}
		};

		// Update existing Manage event
		$scope.update = function() {
			var manageEvent = $scope.manageEvent ;

			manageEvent.$update(function() {
				$location.path('manage-events/' + manageEvent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Manage events
		$scope.find = function() {
			$scope.manageEvents = ManageEvents.query();
		};

		// Find existing Manage event
		$scope.findOne = function() {
			$scope.manageEvent = ManageEvents.get({ 
				manageEventId: $stateParams.manageEventId
			});
		};
	}
]);