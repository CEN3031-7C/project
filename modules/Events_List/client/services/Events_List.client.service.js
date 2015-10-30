'use strict';

//Events_List service used to communicate Events_List REST endpoints
angular.module('Events_List').factory('Events_List', ['$resource',
	function($resource) {
		return $resource('api/Events_List/:Events_ListId', { Events_ListId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);