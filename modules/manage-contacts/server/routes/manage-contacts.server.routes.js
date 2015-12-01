'use strict';

module.exports = function(contact) {
	var manageContacts = require('../controllers/manage-contacts.server.controller');
	var manageContactsPolicy = require('../policies/manage-contacts.server.policy');

	// Manage contacts Routes
	contact.route('/api/manage-contacts').all()
		.get(manageContacts.list).all(manageContactsPolicy.isAllowed)
		.post(manageContacts.create);

	contact.route('/api/manage-contacts/create').all()
		.get(manageContacts.list).all(manageContactsPolicy.isAllowed)
		.post(manageContacts.create);

	contact.route('/api/manage-contacts/:manageContactId').all(manageContactsPolicy.isAllowed)
		.get(manageContacts.read)
		.put(manageContacts.update)
		.delete(manageContacts.delete);

	// Finish by binding the Manage contact middleware
	contact.param('manageContactId', manageContacts.manageContactByID);
};