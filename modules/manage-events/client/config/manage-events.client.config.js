'use strict';

// Configuring the Manage events module
angular.module('manage-events').run(['Menus',
	function(Menus) {
		// Add the Manage events dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Manage events',
			state: 'manage-events',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'manage-events', {
			title: 'List Manage events',
			state: 'manage-events.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'manage-events', {
			title: 'Create Manage event',
			state: 'manage-events.create'
		});
	}
]);