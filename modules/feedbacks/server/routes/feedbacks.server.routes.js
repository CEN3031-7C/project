'use strict';

module.exports = function(app) {
	var feedbacks = require('../controllers/feedbacks.server.controller');
	var feedbacksPolicy = require('../policies/feedbacks.server.policy');

	// Feedbacks Routes
	app.route('/api/feedbacks').all()
		.get(feedbacks.list).all(feedbacksPolicy.isAllowed)
		.post(feedbacks.create);

	app.route('/api/feedbacks/:feedbackId').all(feedbacksPolicy.isAllowed)
		.get(feedbacks.read)
		.put(feedbacks.update)
		.delete(feedbacks.delete);

	// Finish by binding the Feedback middleware
	app.param('feedbackId', feedbacks.feedbackByID);
};