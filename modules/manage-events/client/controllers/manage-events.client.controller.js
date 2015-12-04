'use strict';

// Manage events controller
angular.module('manage-events').controller('ManageEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ManageEvents',
	function($scope, $stateParams, $location, Authentication, ManageEvents ) {
		$scope.authentication = Authentication;

		// Create new Manage event
		$scope.create = function() {
			// Create new Manage event object
			console.log("BLAAAAAAAAAAAAAAAAAAAA");
			var manageEvent = new ManageEvents ({
				name: this.name,
				description: this.description,
				date: this.date,
				link: this.link,
				imageURL: this.imageURL,
				pending: false,
				position: $scope.getPosition()
			});

			// Redirect after save
			manageEvent.$save(function(response) {
				$location.path('admin/manage-events');

				// Clear form fields
				$scope.name = '';
				$scope.description = '';
				$scope.date = '';
				$scope.imageURL = '';
				$scope.link = '';
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
					$location.path('admin/manage-events');
				});
			}
		};

		// Update existing Manage event
		$scope.update = function() {
			var manageEvent = $scope.manageEvent ;

			manageEvent.$update(function() {
				$location.path('admin/manage-events');
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


		$scope.hide = function(manageEvent) {
			if (manageEvent) {
				manageEvent.pending = true;
			}
			manageEvent.$update();
		};

		$scope.show = function(manageEvent) {
			if (manageEvent) {
				manageEvent.pending = false;
			}
			manageEvent.$update();
		};

		$scope.getPosition = function() {
			return $scope.manageEvents.length;
		};

		$scope.disabled = function(date, mode) {
    		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  		};

  		$scope.open = function($event) {
    		$scope.status.opened = true;
  		};

		$scope.toggleDropdown = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		    $scope.status.isopen = !$scope.status.isopen;
		};
	}
]);