
app.controller('NavController', ['$rootScope','$scope','$state', '$window', 'AuthService', 'UserService', ($rootScope, $scope, $state, $window, AuthService, UserService) => {
  $scope.loggedIn = AuthService.isLoggedIn();
  $scope.currentUser = AuthService.returnUser();

  $("#wrapper").removeClass("toggled");
  $('#nav-icon3').removeClass('open');

  $scope.animateHamburger = () => {
    $('#nav-icon3').toggleClass('open');
    $("#wrapper").toggleClass("toggled");
  }

  $scope.logout = () => {
    AuthService.logout();
    $state.go('login');
    $scope.loggedIn = !$scope.loggedIn;
  }

  $scope.$on('newState', () => {
    setTimeout(() => {
      $scope.$apply(() => {
        $scope.loggedIn = AuthService.returnUser();
      })
    }, 1000)
  })

  //side menu li highlight

  let selector, elems, makeActive;
  selector = '.sidebar-nav li';
  elems = document.querySelectorAll(selector);

  makeActive = function () {
      for (var i = 0; i < elems.length; i++)
          elems[i].classList.remove('active');

      this.classList.add('active');
  };

  for (var i = 0; i < elems.length; i++){
    elems[i].addEventListener('click', makeActive);
  }

}])
