'use strict';

//Setting up route
angular.module('imgs').config(['$stateProvider',
	function($stateProvider) {
		// Imgs state routing
		$stateProvider.
		state('admin.imgs', {
			abstract: true,
			url: '/imgs',
			template: '<ui-view/>'
		}).
		state('admin.imgs.list', {
			url: '',
			templateUrl: 'modules/imgs/client/views/list-imgs.client.view.html'
		}).
		state('admin.imgs.create', {
			url: '/create',
			templateUrl: 'modules/imgs/client/views/create-img.client.view.html'
		}).
		state('admin.imgs.view', {
			url: '/:imgId',
			templateUrl: 'modules/imgs/client/views/view-img.client.view.html'
		}).
		state('admin.imgs.edit', {
			url: '/:imgId/edit',
			templateUrl: 'modules/imgs/client/views/edit-img.client.view.html'
		});
	}
]);