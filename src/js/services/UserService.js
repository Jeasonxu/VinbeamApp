'use strict';

app.factory('UserService', ['$window', '$http', 'tokenStorageKey', '$resource', 'api', ($window, $http, tokenStorageKey, $resource, api) => {
  return {
    session: $resource(`${api}/sessions`, {}, {
      establish: {
        method: 'POST',
        isArray: false,
        withCredentials: true,
        headers:  {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    }),
    users: $resource(`${api}/users/:userId`, {userId: '@userId'}, {
      query: {
        method:'GET',
        isArray: false,
        withCredentials: true,
        headers:  {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    }),
    customers: $resource(`${api}/customers`, {}, {
      create: {
        method: 'POST',
        isArray: false,
        withCredentials: true,
        headers:  {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    }),
    findUser: (usersArray, username) => {
      let currentUser;
      usersArray.forEach((user, i) => {
        if(user.username.toString() === username.toString()){
          currentUser = user;
        }
      })
      return currentUser;
    }
  }
}]);
