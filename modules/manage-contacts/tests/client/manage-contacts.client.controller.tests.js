'use strict';

(function() {
	// Manage contacts Controller Spec
	describe('Manage contacts Controller Tests', function() {
		// Initialize global variables
		var ManageContactsController,
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

			// Initialize the Manage contacts controller.
			ManageContactsController = $controller('ManageContactsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Manage contact object fetched from XHR', inject(function(ManageContacts) {
			// Create sample Manage contact using the Manage contacts service
			var sampleManageContact = new ManageContacts({
				name: 'New Manage contact'
			});

			// Create a sample Manage contacts array that includes the new Manage contact
			var sampleManageContacts = [sampleManageContact];

			// Set GET response
			$httpBackend.expectGET('api/manage-contacts').respond(sampleManageContacts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.manageContacts).toEqualData(sampleManageContacts);
		}));

		it('$scope.findOne() should create an array with one Manage contact object fetched from XHR using a manageContactId URL parameter', inject(function(ManageContacts) {
			// Define a sample Manage contact object
			var sampleManageContact = new ManageContacts({
				name: 'New Manage contact'
			});

			// Set the URL parameter
			$stateParams.manageContactId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/manage-contacts\/([0-9a-fA-F]{24})$/).respond(sampleManageContact);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.manageContact).toEqualData(sampleManageContact);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ManageContacts) {
			// Create a sample Manage contact object
			var sampleManageContactPostData = new ManageContacts({
				name: 'New Manage contact'
			});

			// Create a sample Manage contact response
			var sampleManageContactResponse = new ManageContacts({
				_id: '525cf20451979dea2c000001',
				name: 'New Manage contact'
			});

			// Fixture mock form input values
			scope.name = 'New Manage contact';

			// Set POST response
			$httpBackend.expectPOST('api/manage-contacts', sampleManageContactPostData).respond(sampleManageContactResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Manage contact was created
			expect($location.path()).toBe('/manage-contacts/' + sampleManageContactResponse._id);
		}));

		it('$scope.update() should update a valid Manage contact', inject(function(ManageContacts) {
			// Define a sample Manage contact put data
			var sampleManageContactPutData = new ManageContacts({
				_id: '525cf20451979dea2c000001',
				name: 'New Manage contact'
			});

			// Mock Manage contact in scope
			scope.manageContact = sampleManageContactPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/manage-contacts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/manage-contacts/' + sampleManageContactPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid manageContactId and remove the Manage contact from the scope', inject(function(ManageContacts) {
			// Create new Manage contact object
			var sampleManageContact = new ManageContacts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Manage contacts array and include the Manage contact
			scope.manageContacts = [sampleManageContact];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/manage-contacts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleManageContact);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.manageContacts.length).toBe(0);
		}));
	});
}());