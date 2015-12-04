'use strict';

//Manage contacts service used to communicate Manage contacts REST endpoints
angular.module('manage-contacts').factory('ManageContacts', ['$resource',
	function($resource) {
		return $resource('api/manage-contacts/:manageContactId', { manageContactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);