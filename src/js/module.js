'use strict';

let app = angular.module('vinbeam', ['ui.router', 'ngAnimate', 'ngResource', 'ngStorage', 'ui.bootstrap']);

app.constant('tokenStorageKey', 'my-token');
app.constant('api', "http://localhost:3000/api");

app.run(['$rootScope', '$state', 'AuthService', ($rootScope, $state, AuthService) => {

  $rootScope.$on('enterState', () => {
    $rootScope.$broadcast('newState', AuthService);
  });

  $rootScope.$on('logout', () => {

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
  .state('landing', {url: '/', templateUrl: '/html/general/landing.html', controller: 'LandingController'})
  .state('login', { url: '/login', templateUrl: '/html/general/login.html', controller: 'AuthController' })
  .state('dashboard', { url: '/dashboard', templateUrl: '/html/dashboard.html', controller: 'DashController' })
  .state('vehicles', { url: '/vehicles', templateUrl: '/html/vehicles.html', controller: 'VehiclesController' })
  .state('events', { url: '/events', templateUrl: '/html/events.html', controller: 'EventsController' })
  .state('super', { url: '/super', templateUrl: '/html/super.html'})
  .state('super.dashboard', { url: '/dashboard', templateUrl: '/html/partials/dashboard.html', controller: 'SuperController'})

  $urlRouterProvider.otherwise('/');
}]);
