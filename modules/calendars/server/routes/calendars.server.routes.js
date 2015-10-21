'use strict';

module.exports = function(app) {
	var calendars = require('../controllers/calendars.server.controller');
	var calendarsPolicy = require('../policies/calendars.server.policy');

	// Calendars Routes
	app.route('/api/calendars').all()
		.get(calendars.list).all(calendarsPolicy.isAllowed)
		.post(calendars.create);

	app.route('/api/calendars/:calendarId').all(calendarsPolicy.isAllowed)
		.get(calendars.read)
		.put(calendars.update)
		.delete(calendars.delete);

	// Finish by binding the Calendar middleware
	app.param('calendarId', calendars.calendarByID);
};