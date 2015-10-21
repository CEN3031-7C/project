'use strict';

// Pending events controller
angular.module('pending-events').controller('PendingEventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PendingEvents',
	function($scope, $stateParams, $location, Authentication, PendingEvents ) {
		$scope.authentication = Authentication;

		// Create new Pending event
		$scope.create = function() {
			// Create new Pending event object
			var pendingEvent = new PendingEvents ({
				name: this.name
			});

			// Redirect after save
			pendingEvent.$save(function(response) {
				$location.path('pending-events/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pending event
		$scope.remove = function( pendingEvent ) {
			if ( pendingEvent ) { pendingEvent.$remove();

				for (var i in $scope.pendingEvents ) {
					if ($scope.pendingEvents [i] === pendingEvent ) {
						$scope.pendingEvents.splice(i, 1);
					}
				}
			} else {
				$scope.pendingEvent.$remove(function() {
					$location.path('pending-events');
				});
			}
		};

		// Update existing Pending event
		$scope.update = function() {
			var pendingEvent = $scope.pendingEvent ;

			pendingEvent.$update(function() {
				$location.path('pending-events/' + pendingEvent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pending events
		$scope.find = function() {
			$scope.pendingEvents = PendingEvents.query();
		};

		// Find existing Pending event
		$scope.findOne = function() {
			$scope.pendingEvent = PendingEvents.get({ 
				pendingEventId: $stateParams.pendingEventId
			});
		};
	}
]);

angular.module('core').controller('MainCtrl', function ($scope){
  $scope.events = [
    { 
      name: 'Event1', 
      location: 'my house', 
      date: new Date('2014', '03', '08'), 
      img: 'http://www.realtimetext.org/sites/default/files/images/FastText-logo_outline_300.png',
      description: 'bla',
      attending: 0,
    }, 
    { 
      name: 'Event2', 
      location: 'somewhere', 
      date: new Date('2015', '10', '30'), 
      img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfP09bFyczM0dO8wMPk6ezY3eDh5unJzdDR1tlr0sxZAAACVUlEQVR4nO3b23KDIBRA0QgmsaLx//+2KmPi/YJMPafZ6619sOzARJjq7QYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuJyN4+qMZcUri+BV3WQ22iIxSRTGFBITbRGpr218Ckx0EQPrxMfVPRP25QvNaT4xFTeJ1g/sJ4K8/aTuVxdNNJ99/Q0RQWlELtN7xGH9+8KYH1ZEX1hY770C9186Cm2R1TeONGj/paHQury7OwbsvzQUlp/9jakOJ2ooPLf/kl9on4Mtan50EhUUDvfgh8cqv/AxKlw+Cc3vPeUXjg+Kr4VCm+Vbl5LkeKHNTDKbKL9w3yr1B8q5RPmFu75puhPzTKKCwh13i2aJJguJ8gt33PG7GZxN1FC4tWvrB04TNRRu7Lw/S3Q2UUPh+ulpOIPTRB2FKyfgaeAoUUvhkvESnSYqL5ybwVGi7sKlwH6i6sL5JTpKVFZYlr0flmewTbyvX+piC8NyiXHvH9YD37OoqtA1v+wS15ZofxY1FTo/cJ+4NYNJd9BSVOi6kTeJOwLVFbrPyJ3dXqL6Cl1/7G7HDGordMOx7+hTVui2arQXBgVqKgwLVFQYGKinMDRQTWFwoJrC8AfcKLwUhRRSeL3vKkyDVaNLSdIf1snXEBQUyrlUTBQeIbPQD6uK8Zx3+yyHKbf/5N+y/gn78K/Rj/ZmY64Omhg9gHFaJu59i+EDGKf1/tshRxlxEoW+2uXS868EeflDYmDNltUzgkpqXyPGzULyK6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8DV+AUrRI7QWHsWNAAAAAElFTkSuQmCC',
      description: 'bla2',
      attending: 0,
    },
    { 
      name: 'Event3', 
      location: 'somewhere', 
      date: new Date('2015', '10', '30'), 
      img: 'data:image/jpeg;base64,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',
      description: 'bla2',
      attending: 0,
    },
    { 
      name: 'EventN', 
      location: 'somewhere', 
      date: new Date('2015', '10', '30'), 
      img: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRddUP_I34xRtgUdDUP9J67QfsK1mMBJ8qNMBJyzcLHLxU8W-KI',
      description: 'bla2',
      attending: 0,
    }   

  ];
  $scope.plusOne = function(index) {
    $scope.events[index].attending += 1;
  };
  $scope.minusOne = function(index) {
    $scope.events[index].attending += 1;
  };




  $scope.todos = ["Learn Angular", "Learn node"];
  $scope.newItem = "";

  $scope.todosEditor = [false, false]; //Array that holds "false" if the
                                       //corresponding edit form should
                                       //be hidden, true otherwise.

  $scope.warningText = "";             //Text that displays any warnings
                                       //if the user performs an illegal
                                       //action.  

  $scope.completeItems = [false, false];

  $scope.counter = 2;
  
  $scope.addItem = function(){
    console.log("in add");
    if ($scope.newItem !== ""){
      if($scope.todos.indexOf($scope.newItem) === -1){
        $scope.todos.push($scope.newItem);
        $scope.todosEditor.push(false);
        $scope.completeItems.push(false);
        $scope.newItem = ""; //Clearing Input Box
        $scope.warningText = ""; //Get rid of error message.
        $scope.counter += 1;
      }
      else{
        $scope.newItem = ""; //Clearing Input Box
        $scope.warningText = "Error! No repeats allowed!";
      }

    }
  };
    
  $scope.deleteItem = function(item){
    console.log("in delete");
    var index = $scope.todos.indexOf(item);
    $scope.todos.splice(index, 1);
    $scope.completeItems.splice(index, 1);
    $scope.todosEditor.splice(index, 1);
    $scope.counter -=1;
  };

  $scope.showEditor = function(item){   //Shows the appropriate edit
                                        //form.
    var index = $scope.todos.indexOf(item);
    $scope.todosEditor[index] = true;
  };

  $scope.cancelEdit = function(item){   //Cancels the editing action
    var index = $scope.todos.indexOf(item);
    $scope.todos[index] = item;
    $scope.todosEditor[index] = false;
  };

  $scope.editItem = function(item, editedItem){ //Performs the actual
                                                //edit. Lots of
                                                //debugging is implemented
                                                //so nothing should crash
                                                //the webpage.

    if(typeof editedItem === 'undefined'){ //Prevent users from adding blank entries!
      $scope.cancelEdit(item);
      return;
    }

    if(editedItem === ""){   //Prevent users from adding blank entries (that used
                            //to be not blank but were then subsequently erased)
      $scope.cancelEdit(item);
    } 
    else{ //The entry was not blank

      if($scope.todos.indexOf(editedItem) === -1 || item === editedItem){ //We have not a repeat
                                                                        //or we are renaming the item
                                                                        //the same thing.
        var index = $scope.todos.indexOf(item);

        $scope.todos[index] = editedItem;
        $scope.todosEditor[index] = false;  //Close the editing window.

        $scope.warningText = "";            //Get rid of error message.
      }
      else{
        $scope.warningText = "Error! No repeats allowed!";
        return;
      }
      
    }
  };

  $scope.completeItem = function(item){
    var index = $scope.todos.indexOf(item);
    $scope.completeItems[index] = true;
  };

  /* The following function iterates through the
     completeItems array and if element is equal 
     to true it calls delete item on that element 
     in the todos array.*/
  $scope.clearComplete = function(){ 
    var i = 0; // initialize i
    while(i < $scope.counter){
      if($scope.completeItems[i] === true){
        $scope.deleteItem($scope.todos[i]);
        continue; // return to beginning of while loop
      }
      i++;
    }
  };
  
});