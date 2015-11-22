'use strict';

// Configuring the News feeds module
angular.module('news-feeds').run(['Menus',
	function(Menus) {
		// submenu in admin where you can edit the news feed
		Menus.addSubMenuItem('topbar', 'admin', {
			title: 'Manage News feed',
			state: 'admin.news-feeds.list'
		});
	}
]);