'use strict';

// News feeds controller
angular.module('news-feeds').controller('NewsFeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'NewsFeeds',
	function($scope, $stateParams, $location, Authentication, NewsFeeds ) {
		$scope.authentication = Authentication;
		//$scope.preview = $scope.newsFeed.body_text.substring(0, 300);

		// Create new News feed
		$scope.create = function() {
			// Create new News feed object
			var newsFeed = new NewsFeeds ({
				title: this.title,
				author: this.author,
				body_text: this.body_text,
				imageURL: this.imageURL,
				articleLink: this.articleLink,
				date: this.date,
				hidden: false,
				position: $scope.getPosition()

			});

			// Redirect after save
			newsFeed.$save(function(response) {
				$location.path('admin/news-feed');

				// Clear form fields
				$scope.title = '';
				$scope.author = '';
				$scope.body_text = '';
				$scope.imageURL = '';
				$scope.articleLink = '';
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
					$location.path('admin/news-feed');
				});
			}
		};

		// Update existing News feed
		$scope.update = function() {
			var newsFeed = $scope.newsFeed ;

			newsFeed.$update(function() {
				$location.path('admin/news-feed/' + newsFeed._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// hide the news article from front page
		$scope.hide = function(newsFeed) {
			if (newsFeed) {
				newsFeed.hidden = true;
			}
			newsFeed.$update();
		};
		//show the news article on the front page
		$scope.show = function(newsFeed) {
			if (newsFeed) {
				newsFeed.hidden = false;
			}
			newsFeed.$update();
		};
		//move the article up 1 position
		$scope.pushUp = function(newsFeed) {
			//console.log("The size of Array is", $scope.newsFeeds.length);
			var i;
			for (i = 0; i < $scope.newsFeeds.length; i++) {
				if ($scope.newsFeeds [i] === newsFeed) {
					if (i === 0) {
						//console.log("We are at the beginning of the Array");
						return;
					}
					//console.log("Switching ", $scope.newsFeeds[i].name, " with " , $scope.newsFeeds[i-1].name);
					var x = $scope.newsFeeds[i].position;
					var y = $scope.newsFeeds[i-1].position;
					$scope.newsFeeds[i].position = y;
					$scope.newsFeeds[i-1].position = x;
					$scope.newsFeeds [i] = $scope.newsFeeds [i-1];
					$scope.newsFeeds [i-1] = newsFeed;
					$scope.newsFeeds[i].$update();
					$scope.newsFeeds[i-1].$update();
					break;
				}
			}

		};
		//move the article down 1 position
		$scope.pushDown = function(newsFeed) {
			var i;
			for (i = 0; i < $scope.newsFeeds.length; i++) {
				if ($scope.newsFeeds [i] === newsFeed) {
					if (i === $scope.newsFeeds.length -1) {
						return;
					}
					var x = $scope.newsFeeds[i].position;
					var y = $scope.newsFeeds[i+1].position;
					$scope.newsFeeds[i].position = y;
					$scope.newsFeeds[i+1].position = x;
					$scope.newsFeeds [i] = $scope.newsFeeds [i+1];
					$scope.newsFeeds [i+1] = newsFeed;
					$scope.newsFeeds[i].$update();
					$scope.newsFeeds[i+1].$update();
					break;
				}
			}
		};

		//get the position for the new article
		$scope.getPosition = function() {
			return $scope.newsFeeds.length;
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
		//in order to only show a snippet of the article on front page
		$scope.getPreview = function(newsFeed) {
			var preview;
			preview = newsFeed.body_text.substring(0, 450);
			preview = preview + "...";
			return preview;
		};
	}
]);
