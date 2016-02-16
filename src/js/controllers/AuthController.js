
app.controller('AuthController', ['$rootScope','$scope','$state', '$window', 'AuthService', 'UserService', ($rootScope, $scope, $state, $window, AuthService, UserService) => {
  $scope.loginForm = false;
  $scope.formState = "Login";
  // $scope.currentUser;

  ($scope.switchFormView = () => {
    $scope.loginForm = !$scope.loginForm;
    $scope.formState = $scope.loginForm ? $scope.formState = "Login" : $scope.formState = "Register new user"
    $scope.otherState = $scope.loginForm ? $scope.otherState = "Register new user" : $scope.otherState = "Login"
  })();

  $scope.login = (user) => {
    $scope.$emit('loading');
    UserService.session.save({}, user, (data) => {
      $scope.$emit('finished');
      swal({ title: "Success!", text: "redirecting...", timer: 1500, showConfirmButton: false, type: 'success'});
      $scope.loggedIn = !$scope.loggedIn;
      $state.go('dashboard');
      UserService.users.query().$promise.then(data => {
        let currentUser = UserService.findUser(data._embedded.users, user.username);
        AuthService.saveJWT(currentUser);
      });
    });
  }
}])
