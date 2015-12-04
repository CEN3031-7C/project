'use strict';

//Setting up route
angular.module('feedbacks').config(['$stateProvider',
	function($stateProvider) {
		// Feedbacks state routing
		$stateProvider.
		state('feedbacks', {
			abstract: true,
			url: '/feedbacks',
			template: '<ui-view/>'
		}).
		state('feedbacks.create', {
			url: '/create',
			templateUrl: 'modules/feedbacks/client/views/create-feedback.client.view.html'
		}).
		state('feedbacks.view', {
			url: '/:feedbackId',
			templateUrl: 'modules/feedbacks/client/views/view-feedback.client.view.html'
		}).
		state('feedbacks.edit', {
			url: '/:feedbackId/edit',
			templateUrl: 'modules/feedbacks/client/views/edit-feedback.client.view.html'
		}).
		state('admin.feedbacks', {
			abstract: true,
			url: '/feedbacks',
			template: '<ui-view/>'
		}).
		state('admin.feedbacks.list', {
			url: '',
			templateUrl: 'modules/feedbacks/client/views/list-feedbacks.client.view.html'
		});
	}
]);