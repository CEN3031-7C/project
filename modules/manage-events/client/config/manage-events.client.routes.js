'use strict';

//Setting up route
angular.module('manage-events').config(['$stateProvider',
	function($stateProvider) {
		// Manage events state routing
		$stateProvider.
		state('admin.manage-events', {
			abstract: true,
			url: '/manage-events',
			template: '<ui-view/>'
		}).
		state('admin.manage-events.list', {
			url: '',
			templateUrl: 'modules/manage-events/client/views/list-manage-events.client.view.html'
		}).
		state('admin.manage-events.create', {
			url: '/create',
			templateUrl: 'modules/manage-events/client/views/create-manage-event.client.view.html'
		}).
		state('admin.manage-events.view', {
			url: '/:manageEventId',
			templateUrl: 'modules/manage-events/client/views/view-manage-event.client.view.html'
		}).
		state('admin.manage-events.edit', {
			url: '/:manageEventId/edit',
			templateUrl: 'modules/manage-events/client/views/edit-manage-event.client.view.html'
		});
	}
]);