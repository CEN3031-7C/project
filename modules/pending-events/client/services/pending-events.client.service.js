'use strict';

//Pending events service used to communicate Pending events REST endpoints
angular.module('pending-events').factory('PendingEvents', ['$resource',
	function($resource) {
		return $resource('api/pending-events/:pendingEventId', { pendingEventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);