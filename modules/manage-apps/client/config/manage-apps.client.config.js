'use strict';

// Configuring the Manage apps module
angular.module('manage-apps').run(['Menus',
	function(Menus) {
		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'admin', {
			title: 'Manage Apps',
			state: 'admin.manage-apps.list'
		});
	}
]);