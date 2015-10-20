'use strict';

// Configuring the Pending events module
angular.module('pending-events').run(['Menus',
	function(Menus) {
		// Add the Pending events dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Pending events',
			state: 'pending-events',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'pending-events', {
			title: 'List Pending events',
			state: 'pending-events.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'pending-events', {
			title: 'Create Pending event',
			state: 'pending-events.create'
		});
	}
]);