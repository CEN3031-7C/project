'use strict';

module.exports = function(app) {
	var newsFeeds = require('../controllers/news-feeds.server.controller');
	var newsFeedsPolicy = require('../policies/news-feeds.server.policy');

	// News feeds Routes
	app.route('/api/news-feeds').all()
		.get(newsFeeds.list).all(newsFeedsPolicy.isAllowed)
		.post(newsFeeds.create);

	app.route('/api/news-feeds/:newsFeedId').all(newsFeedsPolicy.isAllowed)
		.get(newsFeeds.read)
		.put(newsFeeds.update)
		.delete(newsFeeds.delete);

	// Finish by binding the News feed middleware
	app.param('newsFeedId', newsFeeds.newsFeedByID);
};