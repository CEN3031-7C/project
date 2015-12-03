'use strict';

//Imgs service used to communicate Imgs REST endpoints
angular.module('imgs').factory('Imgs', ['$resource',
	function($resource) {
		return $resource('api/imgs/:imgId', { imgId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);