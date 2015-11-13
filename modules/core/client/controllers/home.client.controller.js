'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ManageApps',
  function ($scope, Authentication, ManageApps) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    
    // Code for functionality of carousel
	$scope.myInterval = 3000;
	$scope.slides = [
	    {
	      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLuVXxIKXJ63Ep-hzVWfb7jXLczDZXa1q6heVO4NsQz8PbJY4M'
	    },
	    {
	      image: 'http://www.irrec.ifas.ufl.edu/images/slider/StudentsLinearGarden.jpg'
	    },
	    {
	      image: 'https://fbcdn-photos-e-a.akamaihd.net/hphotos-ak-frc3/v/t1.0-0/s320x320/1970582_746804095339361_1230654394_n.jpg?oh=2211d48543fc5c5e104ff278c63c71be&oe=56C61076&__gda__=1456148582_71f7e96c6d6cfcf2032bd82af5a77dda'
	    },
	    {
	      image: 'https://cdn.evbuc.com/images/14141724/14144367315/1/logo.jpg'
	    }
    ];

    //to load all the articles from manage-apps shard
    $scope.find = function() {
           console.log("Called find()!");
            $scope.manageApps = ManageApps.query();
    };
  }
]);
