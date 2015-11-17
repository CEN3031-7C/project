'use strict';

//Setting up route
angular.module('news-feeds').config(['$stateProvider',
	function($stateProvider) {
		// News feeds state routing
		$stateProvider.
		state('admin.news-feeds', {
			abstract: true,
			url: '/news-feed',
			template: '<ui-view/>'
		}).
		state('admin.news-feeds.list', {
			url: '',
			templateUrl: 'modules/news-feeds/client/views/list-news-feeds.client.view.html'
		}).
		state('admin.news-feeds.create', {
			url: '/create',
			templateUrl: 'modules/news-feeds/client/views/create-news-feed.client.view.html'
		}).
		state('admin.news-feeds.view', {
			url: '/:newsFeedId',
			templateUrl: 'modules/news-feeds/client/views/view-news-feed.client.view.html'
		}).
		state('admin.news-feeds.edit', {
			url: '/:newsFeedId/edit',
			templateUrl: 'modules/news-feeds/client/views/edit-news-feed.client.view.html'
		});
	}
]);