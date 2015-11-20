'use strict';

(function() {
	// Manage events Controller Spec
	describe('Manage events Controller Tests', function() {
		// Initialize global variables
		var ManageEventsController,
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

			// Initialize the Manage events controller.
			ManageEventsController = $controller('ManageEventsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Manage event object fetched from XHR', inject(function(ManageEvents) {
			// Create sample Manage event using the Manage events service
			var sampleManageEvent = new ManageEvents({
				name: 'New Manage event'
			});

			// Create a sample Manage events array that includes the new Manage event
			var sampleManageEvents = [sampleManageEvent];

			// Set GET response
			$httpBackend.expectGET('api/manage-events').respond(sampleManageEvents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.manageEvents).toEqualData(sampleManageEvents);
		}));

		it('$scope.findOne() should create an array with one Manage event object fetched from XHR using a manageEventId URL parameter', inject(function(ManageEvents) {
			// Define a sample Manage event object
			var sampleManageEvent = new ManageEvents({
				name: 'New Manage event'
			});

			// Set the URL parameter
			$stateParams.manageEventId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/manage-events\/([0-9a-fA-F]{24})$/).respond(sampleManageEvent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.manageEvent).toEqualData(sampleManageEvent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ManageEvents) {
			// Create a sample Manage event object
			var sampleManageEventPostData = new ManageEvents({
				name: 'New Manage event'
			});

			// Create a sample Manage event response
			var sampleManageEventResponse = new ManageEvents({
				_id: '525cf20451979dea2c000001',
				name: 'New Manage event'
			});

			// Fixture mock form input values
			scope.name = 'New Manage event';

			// Set POST response
			$httpBackend.expectPOST('api/manage-events', sampleManageEventPostData).respond(sampleManageEventResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Manage event was created
			expect($location.path()).toBe('/manage-events/' + sampleManageEventResponse._id);
		}));

		it('$scope.update() should update a valid Manage event', inject(function(ManageEvents) {
			// Define a sample Manage event put data
			var sampleManageEventPutData = new ManageEvents({
				_id: '525cf20451979dea2c000001',
				name: 'New Manage event'
			});

			// Mock Manage event in scope
			scope.manageEvent = sampleManageEventPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/manage-events\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/manage-events/' + sampleManageEventPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid manageEventId and remove the Manage event from the scope', inject(function(ManageEvents) {
			// Create new Manage event object
			var sampleManageEvent = new ManageEvents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Manage events array and include the Manage event
			scope.manageEvents = [sampleManageEvent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/manage-events\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleManageEvent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.manageEvents.length).toBe(0);
		}));
	});
}());