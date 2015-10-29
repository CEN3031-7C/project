'use strict';

//Setting up route
angular.module('pending-events').config(['$stateProvider',
	function($stateProvider) {
		// Pending events state routing
		$stateProvider.
		state('admin.pending-events', {
			abstract: true,
			url: '/pending-events',
			template: '<ui-view/>'
		}).
		state('admin.pending-events.list', {
			url: '',
			templateUrl: 'modules/pending-events/client/views/events.client.view.html'//'modules/pending-events/views/list-pending-events.client.view.html'
		}).
		state('admin.pending-events.create', {
			url: '/create',
			templateUrl: 'modules/pending-events/views/create-pending-event.client.view.html'
		}).
		state('admin.pending-events.view', {
			url: '/:pendingEventId',
			templateUrl: 'modules/pending-events/views/view-pending-event.client.view.html'
		}).
		state('admin.pending-events.edit', {
			url: '/:pendingEventId/edit',
			templateUrl: 'modules/pending-events/views/edit-pending-event.client.view.html'
		});
	}
]);