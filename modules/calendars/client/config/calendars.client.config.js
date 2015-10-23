'use strict';

// Configuring the Calendars module
angular.module('calendars').run(['Menus',
	function(Menus) {
		// Add the Calendars dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Calendars',
			state: 'calendars.list',
			roles: ['*']
		});
		Menus.addMenuItem('topbar', {
			title: 'Contact',
			state: 'contact.list',
			roles: ['*']
		});
	}
]);