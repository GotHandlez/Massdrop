  // do not tamper with this code in here, study it, but do not touch
// this Auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('untitled.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.submitted = false;
  $scope.signupSubmitted = false;

  $scope.signin = function (valid) {
    $scope.submitted = true;
    if(valid) {
      Auth.signin($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('com.shortly', token);
          $location.path('/add');
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  $scope.signup = function (valid) {
    $scope.signupSubmitted = true;
    if(valid) {
      Auth.signup($scope.user)
        .then(function (token) {
          console.log('made it to signup');
          $window.localStorage.setItem('com.points', token);
          $location.path('/signin');
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };
});
