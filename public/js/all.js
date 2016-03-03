'use strict';

var app = angular.module('vinbeam', ['ui.router', 'ngAnimate', 'ngResource', 'ngStorage', 'ui.bootstrap', 'smart-table']);

app.constant('tokenStorageKey', 'my-token');

//SWAP API URL WITH NEW URL
app.constant('api', "http://devvinbeam.com:8080/api");

app.run(['$rootScope', '$state', 'UserService', '$sessionStorage', function ($rootScope, $state, UserService, $sessionStorage) {
  $rootScope.currentUser;
  $rootScope.$storage = $sessionStorage;

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    // if($rootScope.$storage._id){
    UserService.users.query({ userId: $rootScope.$storage._id }).$promise.then(function (res) {
      $rootScope.currentUser = res;
    });
    // } else {
    //   event.preventDefault();
    //   return $state.go('login');
    // }
    // return
  });

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

app.config(["$stateProvider", "$locationProvider", "$urlRouterProvider", '$resourceProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $resourceProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $resourceProvider.defaults.stripTrailingSlashes = false;

  $stateProvider
  // .state('landing', {url: '/', templateUrl: '/html/general/landing.html', controller: 'LandingController'})
  .state('login', { url: '/login', templateUrl: '/html/general/login.html', controller: 'AuthController' }).state('dashboard', { url: '/dashboard', templateUrl: '/html/partials/main/dashboard.html', controller: 'DashController' }).state('modules', { url: '/modules', templateUrl: '/html/partials/main/modules.html', controller: 'ModulesController' }).state('vehicles', { url: '/vehicles', templateUrl: '/html/partials/main/vehicles.html', controller: 'VehiclesController' }).state('vehicle', { url: '/vehicle/:vehicle?', templateUrl: '/html/partials/main/vehicle.html', controller: 'VehicleController' }).state('events', { url: '/events', templateUrl: '/html/partials/main/events.html', controller: 'EventsController' }).state('super', { url: '/super', templateUrl: '/html/partials/super/super.html' }).state('super.dashboard', { url: '/dashboard', templateUrl: '/html/partials/super/dashboard.html', controller: 'SuperController' }).state('admin', { url: '/admin', templateUrl: '/html/partials/admin/admin.html' }).state('admin.dashboard', { url: '/dashboard', templateUrl: '/html/partials/admin/dashboard.html', controller: 'AdminController' });

  $urlRouterProvider.otherwise('/login');
}]);
'use strict';

app.controller('AdminController', ['$rootScope', '$scope', '$state', '$window', function ($rootScope, $scope, $state, $window) {

  console.log('admin inside');
}]);
'use strict';

app.controller('AuthController', ['$rootScope', '$scope', '$state', '$window', 'UserService', '$sessionStorage', function ($rootScope, $scope, $state, $window, UserService, $sessionStorage) {
  $scope.loginForm = false;
  $scope.formState = "Login";
  $scope.$storage = $sessionStorage;
  // $scope.currentUser;

  ($scope.switchFormView = function () {
    $scope.loginForm = !$scope.loginForm;
    $scope.formState = $scope.loginForm ? $scope.formState = "Login" : $scope.formState = "Register new user";
    $scope.otherState = $scope.loginForm ? $scope.otherState = "Register new user" : $scope.otherState = "Login";
  })();

  $scope.login = function (user) {
    $scope.$emit('loading');
    UserService.session.establish(user, function (data) {
      $scope.$emit('finished');
      swal({ title: "Success!", text: "redirecting...", timer: 1500, showConfirmButton: false, type: 'success' });
      $scope.loggedIn = !$scope.loggedIn;
      UserService.users.query().$promise.then(function (data) {
        var currentUser = UserService.findUser(data._embedded.users, user.username);
        $scope.$storage._id = currentUser.id;
        $scope.$storage._timeStamp = Date.now();
        if (currentUser.role === "ROLE_SUPERUSER") {
          $state.go('super.dashboard', {}, { reload: true });
        } else {
          $state.go('dashboard', {}, { reload: true });
        }
      });
    });
  };
}]);
'use strict';

app.controller('DashController', ['$scope', '$window', 'DashService', function ($scope, $window, DashService) {
  $scope.$emit('enterState');

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
}]);
'use strict';

app.controller('EventsController', ['$scope', '$window', 'VinbeamService', function ($scope, $window, VinbeamService) {
  VinbeamService.events.query().$promise.then(function (res) {
    console.log(res);
  });
}]);
'use strict';

app.controller('LandingController', ['$scope', '$window', function ($scope, $window) {}]);
'use strict';

app.controller('ModulesController', ['$scope', '$window', 'VinbeamService', function ($scope, $window, VinbeamService) {

  var modules = undefined;
  var page_size = 8;
  $scope.displayModules = [];
  $scope.activeModules = 0;
  $scope.inactiveModules = 0;
  $scope.selectedModule;
  $scope.page_num;
  $scope.start = 0;
  $scope.currentPage = 1;

  ($scope.getModules = function () {
    VinbeamService.modules.query().$promise.then(function (res) {
      modules = res._embedded.modules;
      $scope.selectedModule = modules[0];
      makeMap($scope.selectedModule);
      sortActive();
      $scope.page_num = Math.ceil(modules.length / page_size);
      paginate();
    });
  })();

  var makeMap = function makeMap(module) {
    if (document.getElementById('module_map')) {
      var useragent = navigator.userAgent;
      var mapdiv = document.getElementById("module_map");

      var myLatlng = new google.maps.LatLng(module.currentPosition.latitude, module.currentPosition.longitude);
      var mapOptions = {
        zoom: 8,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(mapdiv, mapOptions);

      var marker = new google.maps.Marker({
        position: myLatlng,
        title: "Module Location"
      });

      marker.setMap(map);
    }
  };

  function paginate() {
    var modules_clone = modules.slice(0);
    $scope.displayModules = modules_clone.splice($scope.start, $scope.start + page_size);
  }

  function sortActive() {
    modules.forEach(function (module, i) {
      module.info.active ? $scope.activeModules++ : $scope.inactiveModules++;
    });
  }

  $scope.nextPage = function () {
    $scope.start = $scope.start += page_size;
    $scope.currentPage++;
    paginate();
  };

  $scope.previousPage = function () {
    $scope.start = $scope.start -= page_size;
    $scope.currentPage--;
    paginate();
  };

  $scope.displayModule = function (module) {
    $scope.selectedModule = module;
    makeMap($scope.selectedModule);
  };
}]);
'use strict';

app.controller('NavController', ['$rootScope', '$scope', '$state', '$window', 'AuthService', 'UserService', function ($rootScope, $scope, $state, $window, AuthService, UserService) {

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
        $scope.loggedIn = AuthService.isLoggedIn();
        if (!$scope.loggedIn) {
          $state.go('login');
        }
        $scope.currentUser = $rootScope.currentUser;
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

app.controller('SuperController', ['$scope', '$window', 'UserService', '$http', 'api', function ($scope, $window, UserService, $http, api) {
  $scope.$emit('enterState');

  $scope.users = [];
  UserService.users.query().$promise.then(function (data) {
    $scope.users = data._embedded.users;
  });

  var makeMap = function makeMap() {
    if (document.getElementById('super-map')) {
      var useragent = navigator.userAgent;
      var mapdiv = document.getElementById("super-map");

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

  $scope.createCustomer = function (customer) {
    UserService.customers.create({
      "name": "Sawgrass Ford",
      "address": "123 Main Street, USA",
      "domain": "sawgrassford.com"
    }, function (data) {
      console.log(data);
    });
  };

  $scope.itemsByPage = 5;
}]);
'use strict';

app.controller('VehicleController', ['$scope', '$window', '$state', 'VinbeamService', function ($scope, $window, $state, VinbeamService) {
  $scope.vehicle;
  $scope.status = [];
  $scope.generalInfo = [];

  ($scope.getVehicle = function () {
    VinbeamService.vehicles.query({ vehicleId: $state.params.vehicle }).$promise.then(function (res) {
      $scope.vehicle = res;
      formatInfo();
      makeMap();
    });
  })();

  var makeMap = function makeMap(module) {
    if (document.getElementById('vehicle_map')) {
      var useragent = navigator.userAgent;
      var mapdiv = document.getElementById("vehicle_map");

      var myLatlng = new google.maps.LatLng($scope.vehicle.latitude, $scope.vehicle.longitude);
      var mapOptions = {
        zoom: 8,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(mapdiv, mapOptions);

      var marker = new google.maps.Marker({
        position: myLatlng,
        title: "Vehicle Location"
      });

      marker.setMap(map);
    }
  };

  var formatInfo = function formatInfo() {
    console.log($scope.vehicle);
  };
}]);
'use strict';

app.controller('VehiclesController', ['$scope', '$window', 'VinbeamService', function ($scope, $window, VinbeamService) {

  var vehicles = undefined;
  var page_size = 8;
  $scope.displayVehicles = [];
  $scope.selectedVehicle;
  $scope.page_num;
  $scope.start = 0;
  $scope.currentPage = 1;

  ($scope.init = function () {
    VinbeamService.stores.query().$promise.then(function (res) {
      $scope.stores = res._embedded.stores;
      console.log($scope.stores[0]);
    });
    VinbeamService.vehicles.query().$promise.then(function (res) {
      vehicles = res._embedded.vehicles;
      $scope.page_num = Math.ceil(vehicles.length / page_size);
      paginate();
    });
  })();

  function paginate() {
    var vehicles_clone = vehicles.slice(0);
    $scope.displayVehicles = vehicles_clone.splice($scope.start, $scope.start + page_size);
  }

  $scope.nextPage = function () {
    $scope.start = $scope.start += page_size;
    $scope.currentPage++;
    paginate();
  };

  $scope.previousPage = function () {
    $scope.start = $scope.start -= page_size;
    $scope.currentPage--;
    paginate();
  };
}]);
'use strict';

var paginateTable = function paginateTable() {
  var controller = ["$scope", function () {
    var vm = undefined;

    vm.displaydata = [];

    for (var prop in vm.datasource) {
      vm.displaydata.push(vm.datasource[prop]);
    }
  }];

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      datasource: '='
    },
    controller: controller,
    controllerAs: 'vm',
    bindToController: true,
    templateUrl: '../../html/directiveTemplates/paginateTable.html'
  };
};

app.directive('paginateTable', paginateTable);
'use strict';

app.factory('AuthService', ['$window', '$http', 'tokenStorageKey', 'api', '$sessionStorage', '$resource', function ($window, $http, tokenStorageKey, api, $sessionStorage, $resource) {
  var AuthService = {};

  AuthService.isLoggedIn = function () {
    var timeStamp = $sessionStorage._timeStamp;
    var currentTime = Date.now();
    return currentTime.valueOf() - timeStamp.valueOf() < 3000000;
  };

  AuthService.logout = function () {
    delete $sessionStorage._timeStamp;
    delete $sessionStorage._id;
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
    session: $resource(api + '/sessions', {}, {
      establish: {
        method: 'POST',
        isArray: false,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    }),
    users: $resource(api + '/users/:userId', { userId: '@userId' }, {
      query: {
        method: 'GET',
        isArray: false,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    }),
    customers: $resource(api + '/customers', {}, {
      create: {
        method: 'POST',
        isArray: false,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    }),
    findUser: function findUser(usersArray, username) {
      var currentUser = undefined;
      usersArray.forEach(function (user, i) {
        if (user.username.toString() === username.toString()) {
          currentUser = user;
        }
      });
      return currentUser;
    }
  };
}]);
'use strict';

app.factory('VinbeamService', ['$window', '$http', '$resource', 'api', function ($window, $http, $resource, api) {
  return {
    vehicles: $resource(api + '/vehicles/:vehicleId', { vehicleId: '@vehicleId' }, {
      query: {
        method: 'GET',
        isArray: false,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    }),
    modules: $resource(api + '/modules/:moduleId', { moduleId: '@moduleId' }, {
      query: {
        method: 'GET',
        isArray: false,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    }),
    stores: $resource(api + '/stores/:storeId', { storeId: '@storeId' }, {
      query: {
        method: 'GET',
        isArray: false,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    }),
    events: $resource(api + '/events/:eventId', { eventId: '@eventId' }, {
      query: {
        method: 'GET',
        isArray: false,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    })
  };
}]);