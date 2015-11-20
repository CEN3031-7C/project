'use strict';

//Setting up route
angular.module('manage-events').config(['$stateProvider',
	function($stateProvider) {
		// Manage events state routing
		$stateProvider.
		state('manage-events', {
			abstract: true,
			url: '/manage-events',
			template: '<ui-view/>'
		}).
		state('manage-events.list', {
			url: '',
			templateUrl: 'modules/manage-events/views/list-manage-events.client.view.html'
		}).
		state('manage-events.create', {
			url: '/create',
			templateUrl: 'modules/manage-events/views/create-manage-event.client.view.html'
		}).
		state('manage-events.view', {
			url: '/:manageEventId',
			templateUrl: 'modules/manage-events/views/view-manage-event.client.view.html'
		}).
		state('manage-events.edit', {
			url: '/:manageEventId/edit',
			templateUrl: 'modules/manage-events/views/edit-manage-event.client.view.html'
		});
	}
]);