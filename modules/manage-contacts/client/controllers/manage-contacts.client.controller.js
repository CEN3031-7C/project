'use strict';

// Manage Contacts controller
angular.module('manage-contacts').controller('ManageContactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ManageContacts',
	function($scope, $stateParams, $location, Authentication, ManageContacts) {
		$scope.authentication = Authentication;
		$scope.manageContacts = ManageContacts.query();


		// Create new Manage Contact
		$scope.create = function() {
			// Create new Manage Contacts object
			var manageContact = new ManageContacts ({
				name: this.name,
				zip_code: this.zip_code,
				county: this.county,
				email: this.email,
				phone_number: this.phone_number,
				hidden: false,
				position: $scope.getPosition()
			});

			console.log($scope.getPosition());

			// Redirect after save
			manageContact.$save(function(response) {
				$location.path('admin/manage-contacts');

				// Clear form fields
				$scope.name = '';
				$scope.zip_code = '';
				$scope.county = '';
				$scope.email = '';
				$scope.phone_number = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Manage Contacts
		$scope.remove = function( manageContact ) {
			if ( manageContact ) {
				manageContact.$remove();

				for (var i in $scope.manageContacts ) {
					if ($scope.manageContacts [i] === manageContact ) {
						$scope.manageContacts.splice(i, 1);
					}
				}
			} else {
				$scope.manageContact.$remove(function() {
					$location.path('admin/manage-contacts');
				});
			}
		};

		// Update existing Manage Contacts
		$scope.update = function() {
			var manageContact = $scope.manageContact ;

			manageContact.$update(function() {
				$location.path('admin/manage-contacts');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.hide = function(manageContact) {
			if (manageContact) {
				manageContact.hidden = true;
			}
			manageContact.$update();
		};

		$scope.show = function(manageContact) {
			if (manageContact) {
				manageContact.hidden = false;
			}
			manageContact.$update();
		};

		$scope.pushUp = function(manageContact) {
			//console.log("The size of Array is", $scope.manageContacts.length);
			var i;
			for (i = 0; i < $scope.manageContacts.length; i++) {
				if ($scope.manageContacts [i] === manageContact) {
					if (i === 0) {
						//console.log("We are at the beginning of the Array");
						return;
					}
					//console.log("Switching ", $scope.manageContacts[i].name, " with " , $scope.manageContacts[i-1].name);
					var x = $scope.manageContacts[i].position;
					var y = $scope.manageContacts[i-1].position;
					$scope.manageContacts[i].position = y;
					$scope.manageContacts[i-1].position = x;	
					$scope.manageContacts [i] = $scope.manageContacts [i-1];
					$scope.manageContacts [i-1] = manageContact;
					$scope.manageContacts[i].$update();
					$scope.manageContacts[i-1].$update();
					break;
				}
			}
				
		};

		$scope.pushDown = function(manageContact) {
			//console.log("The size of Array is", $scope.manageContacts.length);
			var i;
			for (i = 0; i < $scope.manageContacts.length; i++) {
				if ($scope.manageContacts [i] === manageContact) {
					if (i === $scope.manageContacts.length -1) {
						//console.log("We are at the end of the Array");
						return;
					}
					//console.log("Switching ", $scope.manageContacts[i].name, " with " , $scope.manageContacts[i+1].name);
					var x = $scope.manageContacts[i].position;
					var y = $scope.manageContacts[i+1].position;
					$scope.manageContacts[i].position = y;
					$scope.manageContacts[i+1].position = x;
					$scope.manageContacts [i] = $scope.manageContacts [i+1];
					$scope.manageContacts [i+1] = manageContact;
					$scope.manageContacts[i].$update();
					$scope.manageContacts[i+1].$update();	
					break;
				}
			}
			
		};

		// Find a list of Manage apps
		$scope.find = function() {
			$scope.manageContacts = ManageContacts.query();
		};

		$scope.getPosition = function() {
			return $scope.manageContacts.length;
		};

		//$scope.count = function () {
		//	return req;
		//};

		// Find existing Manage app
		$scope.findOne = function() {
			$scope.manageContact = ManageContacts.get({
				manageContactId: $stateParams.manageContactId
			});
		};


	}
]);
