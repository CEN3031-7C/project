'use strict';

(function() {
	// Pending events Controller Spec
	describe('Pending events Controller Tests', function() {
		// Initialize global variables
		var PendingEventsController,
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

			// Initialize the Pending events controller.
			PendingEventsController = $controller('PendingEventsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pending event object fetched from XHR', inject(function(PendingEvents) {
			// Create sample Pending event using the Pending events service
			var samplePendingEvent = new PendingEvents({
				name: 'New Pending event'
			});

			// Create a sample Pending events array that includes the new Pending event
			var samplePendingEvents = [samplePendingEvent];

			// Set GET response
			$httpBackend.expectGET('api/pending-events').respond(samplePendingEvents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pendingEvents).toEqualData(samplePendingEvents);
		}));

		it('$scope.findOne() should create an array with one Pending event object fetched from XHR using a pendingEventId URL parameter', inject(function(PendingEvents) {
			// Define a sample Pending event object
			var samplePendingEvent = new PendingEvents({
				name: 'New Pending event'
			});

			// Set the URL parameter
			$stateParams.pendingEventId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/pending-events\/([0-9a-fA-F]{24})$/).respond(samplePendingEvent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pendingEvent).toEqualData(samplePendingEvent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PendingEvents) {
			// Create a sample Pending event object
			var samplePendingEventPostData = new PendingEvents({
				name: 'New Pending event'
			});

			// Create a sample Pending event response
			var samplePendingEventResponse = new PendingEvents({
				_id: '525cf20451979dea2c000001',
				name: 'New Pending event'
			});

			// Fixture mock form input values
			scope.name = 'New Pending event';

			// Set POST response
			$httpBackend.expectPOST('api/pending-events', samplePendingEventPostData).respond(samplePendingEventResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pending event was created
			expect($location.path()).toBe('/pending-events/' + samplePendingEventResponse._id);
		}));

		it('$scope.update() should update a valid Pending event', inject(function(PendingEvents) {
			// Define a sample Pending event put data
			var samplePendingEventPutData = new PendingEvents({
				_id: '525cf20451979dea2c000001',
				name: 'New Pending event'
			});

			// Mock Pending event in scope
			scope.pendingEvent = samplePendingEventPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/pending-events\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pending-events/' + samplePendingEventPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pendingEventId and remove the Pending event from the scope', inject(function(PendingEvents) {
			// Create new Pending event object
			var samplePendingEvent = new PendingEvents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pending events array and include the Pending event
			scope.pendingEvents = [samplePendingEvent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/pending-events\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePendingEvent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pendingEvents.length).toBe(0);
		}));
	});
}());