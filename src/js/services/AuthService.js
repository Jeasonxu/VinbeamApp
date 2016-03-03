'use strict';

app.factory('AuthService', ['$window', '$http', 'tokenStorageKey', 'api', '$sessionStorage', '$resource', ($window, $http, tokenStorageKey, api, $sessionStorage, $resource) => {
  let AuthService = {};

    AuthService.isLoggedIn = () => {
      let timeStamp = $sessionStorage._timeStamp;
      let currentTime = Date.now();
      return currentTime.valueOf() - timeStamp.valueOf() < 3000000;
    }

    AuthService.logout = () => {
      delete $sessionStorage._timeStamp;
      delete $sessionStorage._id;
    }

  return AuthService;
}]);
