'use strict';

app.factory('UserService', ['$window', '$http', 'tokenStorageKey', '$resource', 'api', ($window, $http, tokenStorageKey, $resource, api) => {
  return {
    session: $resource(`${api}/sessions`, {}, {
      establish: {
        method: 'POST',
        isArray: false,
        headers:{'Content-Type':'application/json'}
      }
    }),
    users: $resource(`${api}/users`, {}, {
      query: {
        method:'GET',
        isArray: false,
        headers:{'Content-Type':'application/json'}
      }
    }),
    customers: $resource(`${api}/customers`, {}, {
      create: {
        method: 'POST',
        isArray: false,
        headers: {'Content-Type':'application/json'}
      }
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
