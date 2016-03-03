'use strict';

let app = angular.module('vinbeam', ['ui.router', 'ngAnimate', 'ngResource', 'ngStorage', 'ui.bootstrap', 'smart-table']);

app.constant('tokenStorageKey', 'my-token');

//SWAP API URL WITH NEW URL
app.constant('api', "http://devvinbeam.com:8080/api");

app.run(['$rootScope', '$state', 'UserService', '$sessionStorage', ($rootScope, $state, UserService, $sessionStorage) => {
  $rootScope.currentUser;
  $rootScope.$storage = $sessionStorage;

  $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
    // if($rootScope.$storage._id){
      UserService.users.query({userId: $rootScope.$storage._id}).$promise.then((res) => {
        $rootScope.currentUser = res;
      });
    // } else {
    //   event.preventDefault();
    //   return $state.go('login');
    // }
    // return
  });

  $rootScope.$on('loading', () => {
    $('.loader').show();
    $('#opaque').show();
    $('.view-container').hide();
  })
  $rootScope.$on('finished', () => {
    $('.loader').hide();
    $('#opaque').hide();
    $('.view-container').show();
  })
}]);

app.config(["$stateProvider", "$locationProvider", "$urlRouterProvider", '$resourceProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $resourceProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $resourceProvider.defaults.stripTrailingSlashes = false;

  $stateProvider
  // .state('landing', {url: '/', templateUrl: '/html/general/landing.html', controller: 'LandingController'})
  .state('login', { url: '/login', templateUrl: '/html/general/login.html', controller: 'AuthController' })
  .state('dashboard', { url: '/dashboard', templateUrl: '/html/partials/main/dashboard.html', controller: 'DashController' })

  .state('modules', { url: '/modules', templateUrl: '/html/partials/main/modules.html', controller: 'ModulesController' })

  .state('vehicles', { url: '/vehicles', templateUrl: '/html/partials/main/vehicles.html', controller: 'VehiclesController' })
  .state('vehicle', { url: '/vehicle/:vehicle?', templateUrl: '/html/partials/main/vehicle.html', controller: 'VehicleController'})

  .state('events', { url: '/events', templateUrl: '/html/partials/main/events.html', controller: 'EventsController' })

  .state('super', { url: '/super', templateUrl: '/html/partials/super/super.html'})
  .state('super.dashboard', { url: '/dashboard', templateUrl: '/html/partials/super/dashboard.html', controller: 'SuperController'})

  .state('admin', { url: '/admin', templateUrl: '/html/partials/admin/admin.html'})
  .state('admin.dashboard', { url: '/dashboard', templateUrl: '/html/partials/admin/dashboard.html', controller: 'AdminController'})

  $urlRouterProvider.otherwise('/login');
}]);
