'use strict';

module.exports = function(app) {
	var imgs = require('../controllers/imgs.server.controller');
	var imgsPolicy = require('../policies/imgs.server.policy');

	// Imgs Routes
	app.route('/api/imgs').all()
		.get(imgs.list).all(imgsPolicy.isAllowed)
		.post(imgs.create);

	app.route('/api/imgs/:imgId').all(imgsPolicy.isAllowed)
		.get(imgs.read)
		.put(imgs.update)
		.delete(imgs.delete);

	// Finish by binding the Img middleware
	app.param('imgId', imgs.imgByID);
};