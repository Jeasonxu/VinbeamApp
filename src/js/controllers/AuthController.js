
app.controller('AuthController', ['$rootScope','$scope','$state', '$window', 'UserService', '$sessionStorage', ($rootScope, $scope, $state, $window, UserService, $sessionStorage) => {
  $scope.loginForm = false;
  $scope.formState = "Login";
  $scope.$storage = $sessionStorage;
  // $scope.currentUser;

  ($scope.switchFormView = () => {
    $scope.loginForm = !$scope.loginForm;
    $scope.formState = $scope.loginForm ? $scope.formState = "Login" : $scope.formState = "Register new user"
    $scope.otherState = $scope.loginForm ? $scope.otherState = "Register new user" : $scope.otherState = "Login"
  })();

  $scope.login = (user) => {
    $scope.$emit('loading');
    UserService.session.establish(user, (data) => {
      $scope.$emit('finished');
      swal({ title: "Success!", text: "redirecting...", timer: 1500, showConfirmButton: false, type: 'success'});
      $scope.loggedIn = !$scope.loggedIn;
      UserService.users.query().$promise.then(data => {
        let currentUser = UserService.findUser(data._embedded.users, user.username);
        $scope.$storage._id = currentUser.id;
        $scope.$storage._timeStamp = Date.now();
        if(currentUser.role === "ROLE_SUPERUSER"){
          $state.go('super.dashboard', {}, { reload: true });
        } else {
          $state.go('dashboard', {}, { reload: true });
        }
      });
    });
  }
}])
