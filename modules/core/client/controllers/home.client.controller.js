'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ManageApps', 'NewsFeeds',
  function ($scope, Authentication, ManageApps, NewsFeeds) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;

    // Code for functionality of carousel
	$scope.myInterval = 3000;
	$scope.slides = [
	    {
	      image: 'http://i.imgur.com/6yDXeff.jpg'
	    },
	    {
	      image: 'http://khalil-shreateh.com/khalil.shtml/images/articles/facebook/trolling.jpg'
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
        $scope.newsFeeds = NewsFeeds.query();
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

    //see if there is any apps to showcase
    $scope.newsToShow = function() {
        var i;
        for (i = 0; i < $scope.newsFeeds.length; i++) {
            if ($scope.newsFeeds[i].hidden === false) {
                //console.log("returning true for apps to show");
                return true;
            }
        }
        //console.log("returning false for apps to show");
        return false;
    };

    $scope.getPreview = function(newsFeed) {
            var preview;
            preview = newsFeed.body_text.substring(0, 450);
            preview = preview + "...";
            return preview;
    };
  }
]);
