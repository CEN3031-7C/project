'use strict';

// Manage apps controller
angular.module('manage-apps').controller('ManageAppsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ManageApps','$uibModal', '$log',
	function($scope, $stateParams, $location, Authentication, ManageApps, $uibModal, $log) {
		$scope.authentication = Authentication;


		// Create new Manage app
		$scope.create = function() {
			// Create new Manage app object
			var manageApp = new ManageApps ({
				name: this.name,
				description: this.description,
				imageURL: this.imageURL,
				appLink: this.appLink,
				hidden: false,
				position: $scope.getPosition()
			});

			console.log($scope.getPosition());

			// Redirect after save
			manageApp.$save(function(response) {
				$location.path('admin/manage-apps');

				// Clear form fields
				$scope.name = '';
				$scope.description = '';
				$scope.imageURL = '';
				$scope.appLink = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Manage app
		$scope.remove = function( manageApp ) {
			if ( manageApp ) { 
				manageApp.$remove();

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

		$scope.hide = function(manageApp) {
			if (manageApp) {
				manageApp.hidden = true;
			}
			manageApp.$update();
		};

		$scope.show = function(manageApp) {
			if (manageApp) {
				manageApp.hidden = false;
			}
			manageApp.$update();
		};

		$scope.pushUp = function(manageApp) {
			//console.log("The size of Array is", $scope.manageApps.length);
			var i;
			for (i = 0; i < $scope.manageApps.length; i++) {
				if ($scope.manageApps [i] === manageApp) {
					if (i === 0) {
						//console.log("We are at the beginning of the Array");
						return;
					}
					//console.log("Switching ", $scope.manageApps[i].name, " with " , $scope.manageApps[i-1].name);
					var x = $scope.manageApps[i].position;
					var y = $scope.manageApps[i-1].position;
					$scope.manageApps[i].position = y;
					$scope.manageApps[i-1].position = x;	
					$scope.manageApps [i] = $scope.manageApps [i-1];
					$scope.manageApps [i-1] = manageApp;
					$scope.manageApps[i].$update();
					$scope.manageApps[i-1].$update();
					break;
				}
			}
				
		};

		$scope.pushDown = function(manageApp) {
			//console.log("The size of Array is", $scope.manageApps.length);
			var i;
			for (i = 0; i < $scope.manageApps.length; i++) {
				if ($scope.manageApps [i] === manageApp) {
					if (i === $scope.manageApps.length -1) {
						//console.log("We are at the end of the Array");
						return;
					}
					//console.log("Switching ", $scope.manageApps[i].name, " with " , $scope.manageApps[i+1].name);
					var x = $scope.manageApps[i].position;
					var y = $scope.manageApps[i+1].position;
					$scope.manageApps[i].position = y;
					$scope.manageApps[i+1].position = x;
					$scope.manageApps [i] = $scope.manageApps [i+1];
					$scope.manageApps [i+1] = manageApp;
					$scope.manageApps[i].$update();
					$scope.manageApps[i+1].$update();	
					break;
				}
			}
			
		};

		// Find a list of Manage apps
		$scope.find = function() {
			$scope.manageApps = ManageApps.query();
		};

		$scope.getPosition = function() {
			return $scope.manageApps.length;
		};

		// Find existing Manage app
		$scope.findOne = function() {
			$scope.manageApp = ManageApps.get({ 
				manageAppId: $stateParams.manageAppId
			});
		};

		//modal to edit the app

		$scope.modalUpdate = function (size, selectedApp) {
			console.log("Well then");
	    	var modalInstance = $uibModal.open({
  		    	animation: $scope.animationsEnabled,
      			templateUrl: 'modules/manage-apps/client/views/edit-app-modal.client.view.html',
      			controller: function ($scope, $uibModalInstance, app) {
      				$scope.app = app;
      			},
      			size: size,
      			resolve: {
        			app: function () {
        				return selectedApp;
        			}
      			}
    		});

		    modalInstance.result.then(function (selectedItem) {
      			$scope.selected = selectedItem;
    		}, function () {
      			$log.info('Modal dismissed at: ' + new Date());
    		});
  		};

	}
]);
