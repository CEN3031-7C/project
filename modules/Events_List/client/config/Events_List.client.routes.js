'use strict';

//Setting up route
angular.module('Events_List').config(['$stateProvider',
	function($stateProvider) {
		// Events_List state routing
		$stateProvider.
		state('Events_List', {
			abstract: true,
			url: '/Events_List',
			template: '<ui-view/>'
		}).
		state('Events_List.Events_List', {
			url: '',
			templateUrl: 'modules/Events_List/client/views/Events_List.client.view.html'
		});
	}
]);