'use strict';

//News feeds service used to communicate News feeds REST endpoints
angular.module('news-feeds').factory('NewsFeeds', ['$resource',
	function($resource) {
		return $resource('api/news-feeds/:newsFeedId', { newsFeedId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);