'use strict';

// Calendars controller
angular.module('calendars').controller('CalendarsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendars',
	function($scope, $stateParams, $location, Authentication, Calendars ) {
		$scope.authentication = Authentication;

		// Create new Calendar
		$scope.create = function() {
			// Create new Calendar object
			var calendar = new Calendars ({
				name: this.name
			});

			// Redirect after save
			calendar.$save(function(response) {
				$location.path('calendars/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Calendar
		$scope.remove = function( calendar ) {
			if ( calendar ) { calendar.$remove();

				for (var i in $scope.calendars ) {
					if ($scope.calendars [i] === calendar ) {
						$scope.calendars.splice(i, 1);
					}
				}
			} else {
				$scope.calendar.$remove(function() {
					$location.path('calendars');
				});
			}
		};

		// Update existing Calendar
		$scope.update = function() {
			var calendar = $scope.calendar ;

			calendar.$update(function() {
				$location.path('calendars/' + calendar._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Calendars
		$scope.find = function() {
			$scope.calendars = Calendars.query();
		};

		// Find existing Calendar
		$scope.findOne = function() {
			$scope.calendar = Calendars.get({ 
				calendarId: $stateParams.calendarId
			});
		};
	}
]);