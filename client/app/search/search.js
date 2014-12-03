angular.module('untitled.search', ['ui.bootstrap'])

.controller('SearchController', function ($scope, $http, $location, Search, AddCard) {
  $scope.loc = "";
  $scope.locations = Search.locations;
  $scope.card = "";
  $scope.search = function() {
    // Search.findHotels($scope.loc, $scope.card);
    Search.recordLoc($scope.loc);
    // console.log($scope.loc);
    $location.path('/results');
  }
});
