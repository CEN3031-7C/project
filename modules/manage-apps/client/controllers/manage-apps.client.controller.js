'use strict';

// Manage apps controller
angular.module('manage-apps').controller('ManageAppsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ManageApps',
	function($scope, $stateParams, $location, Authentication, ManageApps ) {
		$scope.authentication = Authentication;

		// Create new Manage app
		$scope.create = function() {
			// Create new Manage app object
			var manageApp = new ManageApps ({
				name: this.name,
				description: this.description,
				imageURL: this.imageURL
			});

			// Redirect after save
			manageApp.$save(function(response) {
				$location.path('admin/manage-apps');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Manage app
		$scope.remove = function( manageApp ) {
			if ( manageApp ) { manageApp.$remove();

				for (var i in $scope.manageApps ) {
					if ($scope.manageApps [i] === manageApp ) {
						$scope.manageApps.splice(i, 1);
					}
				}
			} else {
				$scope.manageApp.$remove(function() {
					$location.path('admin/manage-apps');
				});
			}
		};

		// Update existing Manage app
		$scope.update = function() {
			var manageApp = $scope.manageApp ;

			manageApp.$update(function() {
				$location.path('admin/manage-apps');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Manage apps
		$scope.find = function() {
			$scope.manageApps = ManageApps.query();
		};

		// Find existing Manage app
		$scope.findOne = function() {
			$scope.manageApp = ManageApps.get({ 
				manageAppId: $stateParams.manageAppId
			});
		};
	}
]);