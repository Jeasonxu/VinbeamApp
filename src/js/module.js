'use strict';

let app = angular.module('vinbeam', ['ui.router', 'ngAnimate', 'ngResource', 'ngStorage']);

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

app.config(["$stateProvider", "$locationProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  // $httpProvider.useApplyAsync(true);

  $stateProvider
  .state('landing', {url: '/', templateUrl: '/html/general/landing.html', controller: 'LandingController'})
  .state('login', { url: '/login', templateUrl: '/html/general/login.html', controller: 'AuthController' })
  .state('about', { url: '/about', templateUrl: '/html/about.html', controller: 'AboutController' })
  .state('dashboard', { url: '/dashboard', templateUrl: '/html/dashboard.html', controller: 'DashController' })
  .state('vehicles', { url: '/vehicles', templateUrl: '/html/vehicles.html', controller: 'VehiclesController' })

  $urlRouterProvider.otherwise('/');
}]);
