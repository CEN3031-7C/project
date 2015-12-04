'use strict';

// Configuring the Manage contacts module
angular.module('manage-contacts').run(['Menus',
	function(Menus) {


		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'admin', {
			title: 'Manage Contacts',
			state: 'admin.manage-contacts.list'
		});
	}
]);
