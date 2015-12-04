'use strict';

(function() {
	// Imgs Controller Spec
	describe('Imgs Controller Tests', function() {
		// Initialize global variables
		var ImgsController,
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

			// Initialize the Imgs controller.
			ImgsController = $controller('ImgsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Img object fetched from XHR', inject(function(Imgs) {
			// Create sample Img using the Imgs service
			var sampleImg = new Imgs({
				name: 'New Img'
			});

			// Create a sample Imgs array that includes the new Img
			var sampleImgs = [sampleImg];

			// Set GET response
			$httpBackend.expectGET('api/imgs').respond(sampleImgs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.imgs).toEqualData(sampleImgs);
		}));

		it('$scope.findOne() should create an array with one Img object fetched from XHR using a imgId URL parameter', inject(function(Imgs) {
			// Define a sample Img object
			var sampleImg = new Imgs({
				name: 'New Img'
			});

			// Set the URL parameter
			$stateParams.imgId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/imgs\/([0-9a-fA-F]{24})$/).respond(sampleImg);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.img).toEqualData(sampleImg);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Imgs) {
			// Create a sample Img object
			var sampleImgPostData = new Imgs({
				name: 'New Img'
			});

			// Create a sample Img response
			var sampleImgResponse = new Imgs({
				_id: '525cf20451979dea2c000001',
				name: 'New Img'
			});

			// Fixture mock form input values
			scope.name = 'New Img';

			// Set POST response
			$httpBackend.expectPOST('api/imgs', sampleImgPostData).respond(sampleImgResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Img was created
			expect($location.path()).toBe('/imgs/' + sampleImgResponse._id);
		}));

		it('$scope.update() should update a valid Img', inject(function(Imgs) {
			// Define a sample Img put data
			var sampleImgPutData = new Imgs({
				_id: '525cf20451979dea2c000001',
				name: 'New Img'
			});

			// Mock Img in scope
			scope.img = sampleImgPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/imgs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/imgs/' + sampleImgPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid imgId and remove the Img from the scope', inject(function(Imgs) {
			// Create new Img object
			var sampleImg = new Imgs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Imgs array and include the Img
			scope.imgs = [sampleImg];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/imgs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleImg);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.imgs.length).toBe(0);
		}));
	});
}());