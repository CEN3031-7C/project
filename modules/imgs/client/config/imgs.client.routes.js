'use strict';

//Setting up route
angular.module('imgs').config(['$stateProvider',
	function($stateProvider) {
		// Imgs state routing
		$stateProvider.
		state('imgs', {
			abstract: true,
			url: '/imgs',
			template: '<ui-view/>'
		}).
		state('imgs.list', {
			url: '',
			templateUrl: 'modules/imgs/views/list-imgs.client.view.html'
		}).
		state('imgs.create', {
			url: '/create',
			templateUrl: 'modules/imgs/views/create-img.client.view.html'
		}).
		state('imgs.view', {
			url: '/:imgId',
			templateUrl: 'modules/imgs/views/view-img.client.view.html'
		}).
		state('imgs.edit', {
			url: '/:imgId/edit',
			templateUrl: 'modules/imgs/views/edit-img.client.view.html'
		});
	}
]);