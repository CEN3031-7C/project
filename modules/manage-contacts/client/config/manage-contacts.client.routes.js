'use strict';

//Setting up route
angular.module('manage-contacts').config(['$stateProvider',
	function($stateProvider) {
		// Manage contacts state routing
		$stateProvider.
		state('admin.manage-contacts', {
			abstract: true,
			url: '/manage-contacts',
			template: '<ui-view/>'
		}).
		state('admin.manage-contacts.list', {
			url: '',
			templateUrl: 'modules/manage-contacts/client/views/list-manage-contacts.client.view.html'
		}).
		state('admin.manage-contacts.create', {
			url: '/create',
			templateUrl: 'modules/manage-contacts/client/views/create-manage-contact.client.view.html'
		}).
		state('admin.manage-contacts.view', {
			url: '/:manageContactId',
			templateUrl: 'modules/manage-contacts/client/views/view-manage-contact.client.view.html'
		}).
		state('admin.manage-contacts.edit', {
			url: '/:manageContactId/edit',
			templateUrl: 'modules/manage-contacts/client/views/edit-manage-contact.client.view.html'
		});
	}
]);