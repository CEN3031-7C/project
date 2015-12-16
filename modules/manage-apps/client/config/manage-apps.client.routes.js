'use strict';

//Setting up route
angular.module('manage-apps').config(['$stateProvider',
	function($stateProvider) {
		// Manage apps state routing
		$stateProvider.
		state('admin.manage-apps', {
			abstract: true,
			url: '/manage-apps',
			template: '<ui-view/>'
		}).
		state('admin.manage-apps.list', {
			url: '',
			templateUrl: 'modules/manage-apps/client/views/list-manage-apps.client.view.html'
		}).
		state('admin.manage-apps.create', {
			url: '/create',
			templateUrl: 'modules/manage-apps/client/views/create-manage-app.client.view.html'
		}).
		state('admin.manage-apps.edit', {
			url: '/:manageAppId/edit',
			templateUrl: 'modules/manage-apps/client/views/edit-manage-app.client.view.html'
		});
	}
]);
