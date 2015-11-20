'use strict';

//Manage apps service used to communicate Manage apps REST endpoints
angular.module('core').factory('ManageApps', ['$resource',
    function($resource) {
        return $resource('api/manage-apps/:manageAppId', { manageAppId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

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