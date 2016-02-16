'use strict';

app.factory('AuthService', ['$window', '$http', 'tokenStorageKey', 'api', '$sessionStorage', ($window, $http, tokenStorageKey, api, $sessionStorage) => {
  let currentUser;

  let AuthService = {
    saveToken: (token) => {
      $window.localStorage[tokenStorageKey] = token;
    },
    getToken: () => {
      return $window.localStorage[tokenStorageKey];
    },
    storeCurrentUser: () => {
      if(AuthService.isLoggedIn()){
        let token = AuthService.getToken();
        let payload = JSON.parse($window.atob(token.split('.')[1]));
        $http.get(`${api}/users/${payload._id}`).then((res) => {
          $sessionStorage.user = res.data;
          console.log($sessionStorage.user);
        })
      } else {
        throw new Error("user is not logged in");
      }
    },
    returnUser: () => {
      return $sessionStorage.user;
    },
    isLoggedIn: () => {
      let token = AuthService.getToken();
      if(token){
        let payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    },
    logout: () => {
      $window.localStorage.removeItem(tokenStorageKey);
      delete $sessionStorage.user
    },
    saveJWT: (user) => {
      $http.post(`http://localhost:3000/auth`, user).then((token) => {
        AuthService.saveToken(token.data);
        AuthService.storeCurrentUser();
      });
    },
  };

  return AuthService;
}]);
