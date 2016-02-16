'use strict';

app.factory('UserService', ['$window', '$http', 'tokenStorageKey', '$resource', 'api', ($window, $http, tokenStorageKey, $resource, api) => {
  return {
    session: $resource(`${api}/sessions`),
    users: $resource(`${api}/users/:uid`, {}, {
      query: {method:'GET',isArray:false}
    }),
    findUser: (usersArray, username) => {
      let currentUser;
      usersArray.forEach((user, i) => {
        if(user.username === username){
          currentUser = user;
        } else {
          currentUser = null;
        }
      })
      return currentUser;
    }
  }
}]);
