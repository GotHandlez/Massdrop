  // do not tamper with this code in here, study it, but do not touch
// this Auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('untitled.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  angular.extend($scope, Auth);
  $scope.user = {};
  // $scope.isAuth = true;

  $scope.signin = function (valid) {
    $scope.submitted = true;
    $scope.signout();
    console.log($scope.isAuth());
    if(valid) {
      Auth.signin($scope.user)
        .then(function (token) {
          console.log(token);
          $window.localStorage.setItem('com.points', token);
          $location.path('/add');
        }, 
        function (error) {
          $scope.isAuth = false;
          console.error(error);
      });
    }
    // $scope.isAuth = false;
  };

  $scope.signup = function (valid) {
    $scope.signupSubmitted = true;
    if(valid) {
      Auth.signup($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('com.points', token);
          $location.path('/signin');
        })
        .catch(function (error) {
          // $scope.isAuth = false;
          console.error(error);
        });
    }
  };
});
