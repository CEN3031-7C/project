'use strict';

module.exports = function(app) {
	var manageContacts = require('../controllers/manage-contacts.server.controller');
	var manageContactsPolicy = require('../policies/manage-contacts.server.policy');

	// Manage contacts Routes
	app.route('/api/manage-contacts').all()
		.get(manageContacts.list).all(manageContactsPolicy.isAllowed)
		.post(manageContacts.create);

	app.route('/api/manage-contacts/:manageContactId').all(manageContactsPolicy.isAllowed)
		.get(manageContacts.read)
		.put(manageContacts.update)
		.delete(manageContacts.delete);

	// Finish by binding the Manage contact middleware
	app.param('manageContactId', manageContacts.manageContactByID);
};