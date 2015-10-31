'use strict';

// Events_List controller
angular.module('Events_List').controller('Events_ListController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events_List',
	function($scope, $stateParams, $location, Authentication, Events_List ) {
		$scope.authentication = Authentication;

		// Create new Events_List
		$scope.create = function() {
			// Create new Events_List object
			var Events_List = new Events_List ({
				name: this.name
			});

			// Redirect after save
			Events_List.$save(function(response) {
				$location.path('Events_List/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Events_List
		$scope.remove = function( Events_List ) {
			if ( Events_List ) { Events_List.$remove();

				for (var i in $scope.Events_List ) {
					if ($scope.Events_List [i] === Events_List ) {
						$scope.Events_List.splice(i, 1);
					}
				}
			} else {
				$scope.Events_List.$remove(function() {
					$location.path('Events_List');
				});
			}
		};

		// Update existing Events_List
		$scope.update = function() {
			var Events_List = $scope.Events_List ;

			Events_List.$update(function() {
				$location.path('Events_List/' + Events_List._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Events_List
		$scope.find = function() {
			$scope.Events_List = Events_List.query();
		};

		// Find existing Events_List
		$scope.findOne = function() {
			$scope.Events_List = Events_List.get({ 
				Events_ListId: $stateParams.Events_ListId
			});
		};
	}
]);