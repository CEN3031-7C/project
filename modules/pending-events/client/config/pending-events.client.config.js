'use strict';

// Configuring the Pending events module
angular.module('pending-events').run(['Menus',
	function(Menus) {
		// Add the Pending events dropdown item
		/*Menus.addMenuItem('topbar', {
			title: 'Pending events',
			state: 'pending-events.list',
			roles: ['admin']
		});*/
		Menus.addSubMenuItem('topbar', 'admin', {
	      title: 'Manage Events',
	      state: 'admin.pending-events.list'
	    });
	}
]);