'use strict';

// Manage events controller
angular.module('manage-events').controller('ManageEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ManageEvents', 'Feedbacks', 
	function($scope, $stateParams, $location, Authentication, ManageEvents, Feedbacks ) {
		$scope.authentication = Authentication;

		$scope.hideArray=[];
		$scope.numFeedbackArray=[];


		$scope.pushHideArray=function() {
			for(var i=0; i < ManageEvents.length; i++){
				$scope.hideArray.push(false);
			}
		};

		// $scope.createNumFeedback=function() {
		// 	var counter = 0;
		// 	for(var i=0; i < ManageEvents.length; i++){
		// 		counter = 0;
		// 		for (var j = 0; j < Feedbacks.length; j++){
		// 			if (ManageEvents.name===$scope.feedbacks.name) counter = counter + 1;
		// 		}
		// 		$scope.numFeedbackArray.push(counter);
		// 		console.log(counter);
		// 	}
		// }

		// set string Compare
		$scope.stringCompare = function( string1,string2 ) {
			if(string1===string2) return true;
			else return false;
		};

		$scope.toggleHideArray=function(item) {
			var index = $scope.manageEvents.indexOf(item);
			if($scope.hideArray[index] === true) $scope.hideArray[index] = false;
			else $scope.hideArray[index] = true;
			console.log('toggleHideArray called');
			console.log(index);
		};



		// Create new Manage event
		$scope.create = function() {
			// Create new Manage event object
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
			console.log($scope.manageEvent.name);
		};

		//find feedbacks
		$scope.findFeedback = function() {
			$scope.feedbacks = Feedbacks.query();
		};

		// Find existing Feedback
		$scope.findOneFeedback = function() {
			$scope.feedback = Feedbacks.get({ 
				feedbackId: $stateParams.feedbackId
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