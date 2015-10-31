'use strict';

//Manage apps service used to communicate Manage apps REST endpoints
angular.module('manage-apps').factory('ManageApps', ['$resource',
	function($resource) {
		return $resource('api/manage-apps/:manageAppId', { manageAppId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);