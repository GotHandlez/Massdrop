angular.module('untitled.results',['ui.bootstrap'])

.controller('ResultsController', function ($scope, $http, Results, Search) {
  $scope.loc = Search.place;
  $scope.items = Results.items;
});
