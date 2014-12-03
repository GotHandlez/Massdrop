angular.module('untitled.addCards',['ui.bootstrap'])

.controller('AddCardsController', function ($scope, $http, AddCard) {
  $scope.cards = AddCard.cards;
  $scope.personalCards = AddCard.personalCards;
  $scope.card = "";
  $scope.points = "";
  $scope.cardToDelete = "";
  $scope.addCard = function() {
    AddCard.addCard($scope.card, $scope.points);
    $scope.card = "";
  	$scope.points = "";
  }

  $scope.deleteCard = function(index) {
  	var key = Object.keys($scope.personalCards)[index];
  	delete $scope.personalCards[key];
  }


  // typeahead="cardin AddCard.cards | filter:$viewValue"
});
