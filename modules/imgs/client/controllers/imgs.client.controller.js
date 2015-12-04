'use strict';

// Imgs controller
angular.module('imgs').controller('ImgsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Imgs',
	function($scope, $stateParams, $location, Authentication, Imgs) {
		$scope.authentication = Authentication;

		$scope.myInterval = 3000;

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

		$scope.getPosition = function() {
			return $scope.imgs.length;
		};

		// Create new Img
		$scope.create = function() {
			// Create new Img object
			var img = new Imgs ({
				name: this.name,
				position: $scope.getPosition()
			});

			// Redirect after save
			img.$save(function(response) {
				$location.path('admin/imgs');

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
					$location.path('admin/imgs');
				});
			}
		};

		// Update existing Img
		$scope.update = function() {
			var img = $scope.img ;

			img.$update(function() {
				$location.path('admin/imgs');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.pushUp = function(img) {
			var i;
			for (i = 0; i < $scope.imgs.length; i++) {
				if ($scope.imgs[i] === img) {
					if (i === 0) {
						return;
					}
					var x = $scope.imgs[i].position;
					var y = $scope.imgs[i-1].position;
					$scope.imgs[i].position = y;
					$scope.imgs[i-1].position = x;	
					$scope.imgs[i] = $scope.imgs[i-1];
					$scope.imgs[i-1] = img;
					$scope.imgs[i].$update();
					$scope.imgs[i-1].$update();
					break;
				}
			}
		};

		$scope.pushDown = function(img) {
			var i;
			for (i = 0; i < $scope.imgs.length; i++) {
				if ($scope.imgs[i] === img) {
					if (i === $scope.imgs.length -1) {
						return;
					}
					var x = $scope.imgs[i].position;
					var y = $scope.imgs[i+1].position;
					$scope.imgs[i].position = y;
					$scope.imgs[i+1].position = x;
					$scope.imgs[i] = $scope.imgs[i+1];
					$scope.imgs[i+1] = img;
					$scope.imgs[i].$update();
					$scope.imgs[i+1].$update();	
					break;
				}
			}			
		};
	}
]);