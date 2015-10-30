'use strict';

(function() {
	// Events_List Controller Spec
	describe('Events_List Controller Tests', function() {
		// Initialize global variables
		var Events_ListController,
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

			// Initialize the Events_List controller.
			Events_ListController = $controller('Events_ListController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Events_List object fetched from XHR', inject(function(Events_List) {
			// Create sample Events_List using the Events_List service
			var sampleEvents_List = new Events_List({
				name: 'New Events_List'
			});

			// Create a sample Events_List array that includes the new Events_List
			var sampleEvents_List = [sampleEvents_List];

			// Set GET response
			$httpBackend.expectGET('api/Events_List').respond(sampleEvents_List);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.Events_List).toEqualData(sampleEvents_List);
		}));

		it('$scope.findOne() should create an array with one Events_List object fetched from XHR using a Events_ListId URL parameter', inject(function(Events_List) {
			// Define a sample Events_List object
			var sampleEvents_List = new Events_List({
				name: 'New Events_List'
			});

			// Set the URL parameter
			$stateParams.Events_ListId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/Events_List\/([0-9a-fA-F]{24})$/).respond(sampleEvents_List);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.Events_List).toEqualData(sampleEvents_List);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Events_List) {
			// Create a sample Events_List object
			var sampleEvents_ListPostData = new Events_List({
				name: 'New Events_List'
			});

			// Create a sample Events_List response
			var sampleEvents_ListResponse = new Events_List({
				_id: '525cf20451979dea2c000001',
				name: 'New Events_List'
			});

			// Fixture mock form input values
			scope.name = 'New Events_List';

			// Set POST response
			$httpBackend.expectPOST('api/Events_List', sampleEvents_ListPostData).respond(sampleEvents_ListResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Events_List was created
			expect($location.path()).toBe('/Events_List/' + sampleEvents_ListResponse._id);
		}));

		it('$scope.update() should update a valid Events_List', inject(function(Events_List) {
			// Define a sample Events_List put data
			var sampleEvents_ListPutData = new Events_List({
				_id: '525cf20451979dea2c000001',
				name: 'New Events_List'
			});

			// Mock Events_List in scope
			scope.Events_List = sampleEvents_ListPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/Events_List\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/Events_List/' + sampleEvents_ListPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid Events_ListId and remove the Events_List from the scope', inject(function(Events_List) {
			// Create new Events_List object
			var sampleEvents_List = new Events_List({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Events_List array and include the Events_List
			scope.Events_List = [sampleEvents_List];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/Events_List\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEvents_List);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.Events_List.length).toBe(0);
		}));
	});
}());