'use strict';

// Configuring the Calendars module
angular.module('calendars').run(['Menus',
	function(Menus) {
		// Add the Calendars dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Events',
			state: 'calendars.eventslist',
			roles: ['*']
		});
		Menus.addMenuItem('topbar', {
			title: 'Contact',
			state: 'contact.list',
			roles: ['*']
		});
	    Menus.addSubMenuItem('topbar', 'admin', {
	      title: 'Manage Events',
	      state: 'calendars.manageevents'
	    });

	}
]);
