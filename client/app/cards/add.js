angular.module('untitled.addCards',['ui.bootstrap'])

.controller('AddCardsController', function ($scope, $http, AddCard) {
  angular.extend($scope, AddCard);

  $scope.addCard = function(valid) {
    $scope.submitted = true;
    if(valid) {
      $scope.addCard($scope.selectedCard, $scope.points);
      $scope.selectedCard = "";
    	$scope.points = "";
      $scope.submitted = false;
    }
  }

  $scope.deleteCard = function(index) {
  	var key = Object.keys($scope.personalCards)[index];
  	delete $scope.personalCards[key];
  }
});
