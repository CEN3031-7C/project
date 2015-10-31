'use strict';

// Configuring the Events_List module
angular.module('Events_List').run(['Menus',
	function(Menus) {
		// Add the Events_List dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Events_List',
			state: 'Events_List.Events_List',
			roles: ['*']
		});
	}
]);