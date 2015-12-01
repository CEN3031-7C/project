'use strict';

// Configuring the Manage apps module
angular.module('manage-contacts').run(['Menus',
	function(Menus) {
		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'admin', {
			title: 'Manage Contacts',
			state: 'admin.manage-contacts.list'
		});
	}
]);