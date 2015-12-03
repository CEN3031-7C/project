'use strict';

// Configuring the Imgs module
angular.module('imgs').run(['Menus',
	function(Menus) {
		// Add the Imgs dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Imgs',
			state: 'imgs',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'imgs', {
			title: 'List Imgs',
			state: 'imgs.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'imgs', {
			title: 'Create Img',
			state: 'imgs.create'
		});
	}
]);