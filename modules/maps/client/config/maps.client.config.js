'use strict';

// Configuring the Articles module
angular.module('maps').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Maps Test',
      state: 'maps',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'maps', {
      title: 'Find Events',
      state: 'maps.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'maps', {
      title: 'Create an Event',
      state: 'maps.create',
      roles: ['user']
    });
  }
]);
