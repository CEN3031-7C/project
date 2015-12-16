'use strict';

angular.module('manage-contacts').controller('SearchContactsController', ['$scope', '$filter', 'Authentication', 'ManageContacts',
  function ($scope, $filter, Authentication, ManageContacts) {
    $scope.authentication = Authentication;
    $scope.manageContacts = ManageContacts.query();
    $scope.buildPager();

//BuildPager Function as a helper function to the SearchBYCounty Function
    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.SearchByCounty();
    };
// SearchByCounty Function that Search into the Contact List looking for whatever is typed inside the Search Bar
    $scope.SearchByCounty = function () {
      $scope.filteredItems = $filter('filter')($scope.manageContact, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.SearchByCounty();
    };
  }
]);
