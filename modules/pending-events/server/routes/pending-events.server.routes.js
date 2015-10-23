'use strict';

module.exports = function(app) {
	var pendingEvents = require('../controllers/pending-events.server.controller');
	var pendingEventsPolicy = require('../policies/pending-events.server.policy');

	// Pending events Routes
	app.route('/api/pending-events').all()
		.get(pendingEvents.list).all(pendingEventsPolicy.isAllowed)
		.post(pendingEvents.create);

	app.route('/api/pending-events/:pendingEventId').all(pendingEventsPolicy.isAllowed)
		.get(pendingEvents.read)
		.put(pendingEvents.update)
		.delete(pendingEvents.delete);

	// Finish by binding the Pending event middleware
	app.param('pendingEventId', pendingEvents.pendingEventByID);
};