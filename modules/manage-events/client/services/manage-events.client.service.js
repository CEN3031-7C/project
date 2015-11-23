'use strict';

//Manage events service used to communicate Manage events REST endpoints
angular.module('manage-events').factory('ManageEvents', ['$resource',
	function($resource) {
		return $resource('api/manage-events/:manageEventId', { manageEventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);