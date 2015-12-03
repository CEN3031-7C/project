'use strict';

// Imgs controller
angular.module('imgs').controller('ImgsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Imgs',
	function($scope, $stateParams, $location, Authentication, Imgs ) {
		$scope.authentication = Authentication;

		// Create new Img
		$scope.create = function() {
			// Create new Img object
			var img = new Imgs ({
				name: this.name
			});

			// Redirect after save
			img.$save(function(response) {
				$location.path('imgs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Img
		$scope.remove = function( img ) {
			if ( img ) { img.$remove();

				for (var i in $scope.imgs ) {
					if ($scope.imgs [i] === img ) {
						$scope.imgs.splice(i, 1);
					}
				}
			} else {
				$scope.img.$remove(function() {
					$location.path('imgs');
				});
			}
		};

		// Update existing Img
		$scope.update = function() {
			var img = $scope.img ;

			img.$update(function() {
				$location.path('imgs/' + img._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Imgs
		$scope.find = function() {
			$scope.imgs = Imgs.query();
		};

		// Find existing Img
		$scope.findOne = function() {
			$scope.img = Imgs.get({ 
				imgId: $stateParams.imgId
			});
		};
	}
]);