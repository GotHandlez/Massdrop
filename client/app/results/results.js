angular.module('untitled.results',['ui.bootstrap'])

.controller('ResultsController', function ($scope, $http, Results, Search) {
  $scope.loc = Search.place.loc;
  $scope.items = Results.items;
});
