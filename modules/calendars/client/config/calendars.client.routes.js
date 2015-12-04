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
		state('calendars.gCalendar', {
			url: '/gCalendar',
			templateUrl: 'modules/calendars/client/views/Google_Calendar.client.view.html'
		}).
		state('calendars.list', {
			url: '',
			templateUrl: 'modules/calendars/client/views/calendar.client.view.html'
		}).
		state('calendars.eventslist', {
			url: '/eventsList',
			templateUrl: 'modules/calendars/client/views/Events_List.client.view.html'
		}).
		//manage events
		state('calendars.manageevents', {
			url: '/manage-events',
			templateUrl: 'modules/calendars/client/views/manage-events.client.view.html'
		}).
		//submit feedback
		state('calendars.feedback', {
			url: '/:calendarId/feedback',
			templateUrl: 'modules/calendars/client/views/Event.feedback.client.view.html'
		}).
		state('calendars.create', {
			url: '/create',
			templateUrl: 'modules/calendars/client/views/create-calendar.client.view.html'
		}).
		//submit an event
		state('calendars.submitevent', {
			url: '/submitEvent',
			templateUrl: 'modules/calendars/client/views/submit-event.client.view.html'
		}).
		state('calendars.view', {
			url: '/:calendarId',
			templateUrl: 'modules/calendars/client/views/view-calendar.client.view.html'
		}).

		state('calendars.edit', {
			url: '/:calendarId/edit',
			templateUrl: 'modules/calendars/client/views/edit-calendar.client.view.html'
		}).

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
