'use strict';

var app = angular.module('vinbeam', ['ui.router', 'ngAnimate', 'ngResource', 'ngStorage']);

app.constant('tokenStorageKey', 'my-token');
app.constant('api', "http://localhost:3000/api");

app.run(['$rootScope', '$state', 'AuthService', function ($rootScope, $state, AuthService) {

  $rootScope.$on('enterState', function () {
    $rootScope.$broadcast('newState', AuthService);
  });

  $rootScope.$on('logout', function () {});

  $rootScope.$on('loading', function () {
    $('.loader').show();
    $('#opaque').show();
    $('.view-container').hide();
  });
  $rootScope.$on('finished', function () {
    $('.loader').hide();
    $('#opaque').hide();
    $('.view-container').show();
  });
}]);

app.config(["$stateProvider", "$locationProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  // $httpProvider.useApplyAsync(true);

  $stateProvider.state('landing', { url: '/', templateUrl: '/html/general/landing.html', controller: 'LandingController' }).state('login', { url: '/login', templateUrl: '/html/general/login.html', controller: 'AuthController' }).state('about', { url: '/about', templateUrl: '/html/about.html', controller: 'AboutController' }).state('dashboard', { url: '/dashboard', templateUrl: '/html/dashboard.html', controller: 'DashController' }).state('vehicles', { url: '/vehicles', templateUrl: '/html/vehicles.html', controller: 'VehiclesController' });

  $urlRouterProvider.otherwise('/');
}]);
'use strict';

app.controller('AuthController', ['$rootScope', '$scope', '$state', '$window', 'AuthService', 'UserService', function ($rootScope, $scope, $state, $window, AuthService, UserService) {
  $scope.loginForm = false;
  $scope.formState = "Login";
  // $scope.currentUser;

  ($scope.switchFormView = function () {
    $scope.loginForm = !$scope.loginForm;
    $scope.formState = $scope.loginForm ? $scope.formState = "Login" : $scope.formState = "Register new user";
    $scope.otherState = $scope.loginForm ? $scope.otherState = "Register new user" : $scope.otherState = "Login";
  })();

  $scope.login = function (user) {
    $scope.$emit('loading');
    UserService.session.save({}, user, function (data) {
      $scope.$emit('finished');
      swal({ title: "Success!", text: "redirecting...", timer: 1500, showConfirmButton: false, type: 'success' });
      $scope.loggedIn = !$scope.loggedIn;
      $state.go('dashboard');
      UserService.users.query().$promise.then(function (data) {
        var currentUser = UserService.findUser(data._embedded.users, user.username);
        AuthService.saveJWT(currentUser);
      });
    });
  };
}]);
'use strict';

app.controller('DashController', ['$scope', '$window', 'DashService', 'AuthService', function ($scope, $window, DashService, AuthService) {
  $scope.$emit('enterState');
  // console.log("dashboard: ", AuthService.data.loggedInUser);

  var makeMap = function makeMap() {
    if (document.getElementById('map')) {
      var useragent = navigator.userAgent;
      var mapdiv = document.getElementById("map");

      var myLatlng = new google.maps.LatLng(47.609, -122.333);
      var mapOptions = {
        zoom: 8,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      new google.maps.Map(mapdiv, mapOptions);
    }
  };

  $scope.$on('$viewContentLoaded', function () {
    makeMap();
  });

  $scope.getUser = function () {
    console.log(AuthService.data.loggedInUser);
  };
}]);
'use strict';

app.controller('LandingController', ['$scope', '$window', function ($scope, $window) {}]);
'use strict';

app.controller('NavController', ['$rootScope', '$scope', '$state', '$window', 'AuthService', 'UserService', function ($rootScope, $scope, $state, $window, AuthService, UserService) {
  $scope.loggedIn = AuthService.isLoggedIn();
  $scope.currentUser = AuthService.returnUser();

  $("#wrapper").removeClass("toggled");
  $('#nav-icon3').removeClass('open');

  $scope.animateHamburger = function () {
    $('#nav-icon3').toggleClass('open');
    $("#wrapper").toggleClass("toggled");
  };

  $scope.logout = function () {
    AuthService.logout();
    $state.go('login');
    $scope.loggedIn = !$scope.loggedIn;
  };

  $scope.$on('newState', function () {
    setTimeout(function () {
      $scope.$apply(function () {
        $scope.loggedIn = AuthService.returnUser();
      });
    }, 1000);
  });

  //side menu li highlight

  var selector = undefined,
      elems = undefined,
      makeActive = undefined;
  selector = '.sidebar-nav li';
  elems = document.querySelectorAll(selector);

  makeActive = function makeActive() {
    for (var i = 0; i < elems.length; i++) {
      elems[i].classList.remove('active');
    }this.classList.add('active');
  };

  for (var i = 0; i < elems.length; i++) {
    elems[i].addEventListener('click', makeActive);
  }
}]);
'use strict';

app.controller('VehiclesController', ['$scope', '$window', function ($scope, $window) {}]);
'use strict';

app.factory('AuthService', ['$window', '$http', 'tokenStorageKey', 'api', '$sessionStorage', function ($window, $http, tokenStorageKey, api, $sessionStorage) {
  var currentUser = undefined;

  var AuthService = {
    saveToken: function saveToken(token) {
      $window.localStorage[tokenStorageKey] = token;
    },
    getToken: function getToken() {
      return $window.localStorage[tokenStorageKey];
    },
    storeCurrentUser: function storeCurrentUser() {
      if (AuthService.isLoggedIn()) {
        var token = AuthService.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        $http.get(api + '/users/' + payload._id).then(function (res) {
          $sessionStorage.user = res.data;
          console.log($sessionStorage.user);
        });
      } else {
        throw new Error("user is not logged in");
      }
    },
    returnUser: function returnUser() {
      return $sessionStorage.user;
    },
    isLoggedIn: function isLoggedIn() {
      var token = AuthService.getToken();
      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    },
    logout: function logout() {
      $window.localStorage.removeItem(tokenStorageKey);
      delete $sessionStorage.user;
    },
    saveJWT: function saveJWT(user) {
      $http.post('http://localhost:3000/auth', user).then(function (token) {
        AuthService.saveToken(token.data);
        AuthService.storeCurrentUser();
      });
    }
  };

  return AuthService;
}]);
'use strict';

app.factory('DashService', ['$window', '$http', 'api', function ($window, $http, api) {
  var DashService = {};

  return DashService;
}]);
'use strict';

app.factory('UserService', ['$window', '$http', 'tokenStorageKey', '$resource', 'api', function ($window, $http, tokenStorageKey, $resource, api) {
  return {
    session: $resource(api + '/sessions'),
    users: $resource(api + '/users/:uid', {}, {
      query: { method: 'GET', isArray: false }
    }),
    findUser: function findUser(usersArray, username) {
      var currentUser = undefined;
      usersArray.forEach(function (user, i) {
        if (user.username === username) {
          currentUser = user;
        } else {
          currentUser = null;
        }
      });
      return currentUser;
    }
  };
}]);