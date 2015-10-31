'use strict';

(function() {
	// Manage apps Controller Spec
	describe('Manage apps Controller Tests', function() {
		// Initialize global variables
		var ManageAppsController,
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

			// Initialize the Manage apps controller.
			ManageAppsController = $controller('ManageAppsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Manage app object fetched from XHR', inject(function(ManageApps) {
			// Create sample Manage app using the Manage apps service
			var sampleManageApp = new ManageApps({
				name: 'New Manage app'
			});

			// Create a sample Manage apps array that includes the new Manage app
			var sampleManageApps = [sampleManageApp];

			// Set GET response
			$httpBackend.expectGET('api/manage-apps').respond(sampleManageApps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.manageApps).toEqualData(sampleManageApps);
		}));

		it('$scope.findOne() should create an array with one Manage app object fetched from XHR using a manageAppId URL parameter', inject(function(ManageApps) {
			// Define a sample Manage app object
			var sampleManageApp = new ManageApps({
				name: 'New Manage app'
			});

			// Set the URL parameter
			$stateParams.manageAppId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/manage-apps\/([0-9a-fA-F]{24})$/).respond(sampleManageApp);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.manageApp).toEqualData(sampleManageApp);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ManageApps) {
			// Create a sample Manage app object
			var sampleManageAppPostData = new ManageApps({
				name: 'New Manage app'
			});

			// Create a sample Manage app response
			var sampleManageAppResponse = new ManageApps({
				_id: '525cf20451979dea2c000001',
				name: 'New Manage app'
			});

			// Fixture mock form input values
			scope.name = 'New Manage app';

			// Set POST response
			$httpBackend.expectPOST('api/manage-apps', sampleManageAppPostData).respond(sampleManageAppResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Manage app was created
			expect($location.path()).toBe('/manage-apps/' + sampleManageAppResponse._id);
		}));

		it('$scope.update() should update a valid Manage app', inject(function(ManageApps) {
			// Define a sample Manage app put data
			var sampleManageAppPutData = new ManageApps({
				_id: '525cf20451979dea2c000001',
				name: 'New Manage app'
			});

			// Mock Manage app in scope
			scope.manageApp = sampleManageAppPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/manage-apps\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/manage-apps/' + sampleManageAppPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid manageAppId and remove the Manage app from the scope', inject(function(ManageApps) {
			// Create new Manage app object
			var sampleManageApp = new ManageApps({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Manage apps array and include the Manage app
			scope.manageApps = [sampleManageApp];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/manage-apps\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleManageApp);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.manageApps.length).toBe(0);
		}));
	});
}());