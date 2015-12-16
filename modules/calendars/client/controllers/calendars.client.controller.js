'use strict';

// Calendars controller
angular.module('calendars').controller('CalendarsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Calendars', 'ManageEvents', 'Feedbacks',
	function($scope, $stateParams, $location, Authentication, Calendars, ManageEvents, Feedbacks ) {
		$scope.authentication = Authentication;

		// Create new Calendar
		$scope.create = function() {
			// Create new Calendar object
			console.log("TESTTTTTTT");
			var calendar = new Calendars ({
				summary: this.summary
			});

			// Redirect after save
			calendar.$save(function(response) {
				$location.path('calendars/eventsList');

				// Clear form fields
				$scope.summary = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Create new Feedback
		$scope.createFeedback = function(stringTest) {
			// Create new Feedback object
			console.log("createFeedback called");
			var feedback = new Feedbacks ({
				name: stringTest,
			});

			// // Redirect after save
			feedback.$save(function(response) {
			// 	//$location.path('calendars/eventsList');
			 	$location.path('feedbacks/'+feedback._id+'/edit');

				// Clear form fields
				//$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Create new Manage event object
		$scope.createMongo = function() {
			console.log("createMongo");
			var manageEvent = new ManageEvents ({
				name: this.name,
				description: this.description,
				date: this.date,
				imageURL: this.imageURL,
				link: this.link,
				pending: true,
				position: $scope.getPosition()
			});

			// Redirect after save
			console.log("createMongoSave");
			manageEvent.$save(function(response) {
				$location.path('calendars/eventsList');

				// Clear form fields
				$scope.name = '';
				$scope.description = '';
				$scope.imageURL = '';
				$scope.link = '';
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
			console.log("Called find()!");
			$scope.calendars = Calendars.query();
			$scope.manageEvents = ManageEvents.query();
		};

		// Find existing Calendar
		$scope.findOne = function() {
			$scope.calendar = Calendars.get({ 
				calendarId: $stateParams.calendarId
			});
		};

		$scope.getPosition = function() {
			return $scope.manageEvents.length;
		};
	}
]);