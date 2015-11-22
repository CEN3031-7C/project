'use strict';

(function() {
	// News feeds Controller Spec
	describe('News feeds Controller Tests', function() {
		// Initialize global variables
		var NewsFeedsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the News feeds controller.
			NewsFeedsController = $controller('NewsFeedsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one News feed object fetched from XHR', inject(function(NewsFeeds) {
			// Create sample News feed using the News feeds service
			var sampleNewsFeed = new NewsFeeds({
				name: 'New News feed'
			});

			// Create a sample News feeds array that includes the new News feed
			var sampleNewsFeeds = [sampleNewsFeed];

			// Set GET response
			$httpBackend.expectGET('api/news-feeds').respond(sampleNewsFeeds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.newsFeeds).toEqualData(sampleNewsFeeds);
		}));

		it('$scope.findOne() should create an array with one News feed object fetched from XHR using a newsFeedId URL parameter', inject(function(NewsFeeds) {
			// Define a sample News feed object
			var sampleNewsFeed = new NewsFeeds({
				name: 'New News feed'
			});

			// Set the URL parameter
			$stateParams.newsFeedId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/news-feeds\/([0-9a-fA-F]{24})$/).respond(sampleNewsFeed);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.newsFeed).toEqualData(sampleNewsFeed);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(NewsFeeds) {
			// Create a sample News feed object
			var sampleNewsFeedPostData = new NewsFeeds({
				name: 'New News feed'
			});

			// Create a sample News feed response
			var sampleNewsFeedResponse = new NewsFeeds({
				_id: '525cf20451979dea2c000001',
				name: 'New News feed'
			});

			// Fixture mock form input values
			scope.name = 'New News feed';

			// Set POST response
			$httpBackend.expectPOST('api/news-feeds', sampleNewsFeedPostData).respond(sampleNewsFeedResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the News feed was created
			expect($location.path()).toBe('/news-feeds/' + sampleNewsFeedResponse._id);
		}));

		it('$scope.update() should update a valid News feed', inject(function(NewsFeeds) {
			// Define a sample News feed put data
			var sampleNewsFeedPutData = new NewsFeeds({
				_id: '525cf20451979dea2c000001',
				name: 'New News feed'
			});

			// Mock News feed in scope
			scope.newsFeed = sampleNewsFeedPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/news-feeds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/news-feeds/' + sampleNewsFeedPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid newsFeedId and remove the News feed from the scope', inject(function(NewsFeeds) {
			// Create new News feed object
			var sampleNewsFeed = new NewsFeeds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new News feeds array and include the News feed
			scope.newsFeeds = [sampleNewsFeed];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/news-feeds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleNewsFeed);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.newsFeeds.length).toBe(0);
		}));
	});
}());