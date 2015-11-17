'use strict';

// News feeds controller
angular.module('news-feeds').controller('NewsFeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'NewsFeeds',
	function($scope, $stateParams, $location, Authentication, NewsFeeds ) {
		$scope.authentication = Authentication;

		// Create new News feed
		$scope.create = function() {
			// Create new News feed object
			var newsFeed = new NewsFeeds ({
				title: this.title,

			});

			// Redirect after save
			newsFeed.$save(function(response) {
				$location.path('admin/news-feeds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing News feed
		$scope.remove = function( newsFeed ) {
			if ( newsFeed ) { newsFeed.$remove();

				for (var i in $scope.newsFeeds ) {
					if ($scope.newsFeeds [i] === newsFeed ) {
						$scope.newsFeeds.splice(i, 1);
					}
				}
			} else {
				$scope.newsFeed.$remove(function() {
					$location.path('admin/news-feeds');
				});
			}
		};

		// Update existing News feed
		$scope.update = function() {
			var newsFeed = $scope.newsFeed ;

			newsFeed.$update(function() {
				$location.path('admin/news-feeds/' + newsFeed._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of News feeds
		$scope.find = function() {
			$scope.newsFeeds = NewsFeeds.query();
		};

		// Find existing News feed
		$scope.findOne = function() {
			$scope.newsFeed = NewsFeeds.get({ 
				newsFeedId: $stateParams.newsFeedId
			});
		};
	}
]);