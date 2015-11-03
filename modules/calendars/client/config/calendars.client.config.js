'use strict';

// Configuring the Calendars module
angular.module('calendars').run(['Menus',
	function(Menus) {
		// Add the Calendars dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Events',
			state: 'calendars',
			type: 'dropdown',
			roles: ['*']
		});
		Menus.addMenuItem('topbar', {
			title: 'Contact',
			state: 'contact.list',
			roles: ['*']
		});
		Menus.addSubMenuItem('topbar', 'calendars', {
	      title: 'Events List',
	      state: 'calendars.eventslist'
	    });
		/*
	    Menus.addSubMenuItem('topbar', 'calendars', {
	      title: 'Old Events List',
	      state: 'calendars.list'
	    });
	    */
	}
]);
