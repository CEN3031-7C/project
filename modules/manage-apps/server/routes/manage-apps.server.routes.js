'use strict';

module.exports = function(app) {
	var manageApps = require('../controllers/manage-apps.server.controller');
	var manageAppsPolicy = require('../policies/manage-apps.server.policy');

	// Manage apps Routes
	app.route('/api/manage-apps').all()
		.get(manageApps.list).all(manageAppsPolicy.isAllowed)
		.post(manageApps.create);

	app.route('/api/manage-apps/create').all()
		.get(manageApps.list).all(manageAppsPolicy.isAllowed)
		.post(manageApps.create);

	app.route('/api/manage-apps/:manageAppId').all(manageAppsPolicy.isAllowed)
		.get(manageApps.read)
		.put(manageApps.update)
		.delete(manageApps.delete);

	// Finish by binding the Manage app middleware
	app.param('manageAppId', manageApps.manageAppByID);
};