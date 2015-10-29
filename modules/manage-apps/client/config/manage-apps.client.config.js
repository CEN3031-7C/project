'use strict';

// Configuring the Manage apps module
angular.module('manage-apps').run(['Menus',
	function(Menus) {
		// Add the Manage apps dropdown item
		//Menus.addMenuItem('topbar', {
		//	title: 'Manage apps',
		//	state: 'manage-apps',
		//	type: 'dropdown'
		//});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'admin', {
			title: 'Manage Apps',
			state: 'admin.manage-apps.list'
		});

		// Add the dropdown create item
		//Menus.addSubMenuItem('topbar', 'manage-apps', {
		//	title: 'Create Manage app',
		//	state: 'manage-apps.create'
		//});
	}
]);