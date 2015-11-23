'use strict';

module.exports = function(app) {
	var manageEvents = require('../controllers/manage-events.server.controller');
	var manageEventsPolicy = require('../policies/manage-events.server.policy');

	// Manage events Routes
	app.route('/api/manage-events').all()
		.get(manageEvents.list).all(manageEventsPolicy.isAllowed)
		.post(manageEvents.create);

	app.route('/api/manage-events/create').all()
		.get(manageEvents.list).all(manageEventsPolicy.isAllowed)
		.post(manageEvents.create);

	app.route('/api/manage-events/:manageEventId').all(manageEventsPolicy.isAllowed)
		.get(manageEvents.read)
		.put(manageEvents.update)
		.delete(manageEvents.delete);

	// Finish by binding the Manage event middleware
	app.param('manageEventId', manageEvents.manageEventByID);
};