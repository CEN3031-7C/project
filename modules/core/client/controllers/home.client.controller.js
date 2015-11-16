'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ManageApps',
  function ($scope, Authentication, ManageApps) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    
    // Code for functionality of carousel
	$scope.myInterval = 3000;
	$scope.slides = [
	    {
	      image: 'http://i.imgur.com/6yDXeff.jpg'
	    },
	    {
	      image: 'http://www.irrec.ifas.ufl.edu/images/slider/StudentsLinearGarden.jpg'
	    },
	    {
	      image: 'http://i.imgur.com/2hlP4Wt.jpg'
	    },
	    {
	      image: 'http://i.imgur.com/meC86aq.jpg'
	    },
	    {
	      image: 'http://i.imgur.com/TkLPzNn.jpg'
	    }
    ];

    //to load all the articles from manage-apps shard
    $scope.find = function() {
        console.log("Called find()!");
        $scope.manageApps = ManageApps.query();
    };

    //see if there is any apps to showcase
    $scope.appsToShow = function() {
    	var i;
    	for (i = 0; i < $scope.manageApps.length; i++) {
    		if ($scope.manageApps[i].hidden === false) {
    			//console.log("returning true for apps to show");
    			return true;
    		}
    	}
    	//console.log("returning false for apps to show");
    	return false;
    };
  }
]);
