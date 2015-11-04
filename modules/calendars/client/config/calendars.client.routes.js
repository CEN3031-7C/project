'use strict';

//Setting up route
angular.module('calendars').config(['$stateProvider',
	function($stateProvider) {
		// Calendars state routing
		$stateProvider.
		state('calendars', {
			abstract: true,
			url: '/calendars',
			template: '<ui-view/>'
		}).
		state('calendars.list', {
			url: '',
			templateUrl: 'modules/calendars/client/views/calendar.client.view.html'
		}).
		state('calendars.eventslist', {
			url: '/eventsList',
			templateUrl: 'modules/calendars/client/views/Events_List.client.view.html'
		}).
		state('calendars.create', {
			url: '/create',
			templateUrl: 'modules/calendars/client/views/create-calendar.client.view.html'
		}).
		state('calendars.view', {
			url: '/:calendarId',
			templateUrl: 'modules/calendars/client/views/view-calendar.client.view.html'
		}).

		state('calendars.edit', {
			url: '/:calendarId/edit',
			templateUrl: 'modules/calendars/client/views/edit-calendar.client.view.html'
		}).
/*
		state('calendars.Google_calendar', {
			url: '/Google_Calendar',
			templateUrl: 'modules/calendars/client/views/Google_Calendar.client.view.html'
		}).
*/
		state('contact', {
			abstract: true,
			url: '/contact',
			template: '<ui-view/>'
		}).
		state('contact.list', {
			url: '',
			templateUrl: 'modules/calendars/client/views/contact.client.view.html'
		});
	}
]);
