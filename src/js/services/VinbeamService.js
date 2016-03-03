app.factory('VinbeamService', ['$window', '$http', '$resource', 'api', ($window, $http, $resource, api) => {
  return {
    vehicles: $resource(`${api}/vehicles/:vehicleId`, {vehicleId: '@vehicleId'}, {
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
    modules: $resource(`${api}/modules/:moduleId`, {moduleId: '@moduleId'}, {
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
    stores: $resource(`${api}/stores/:storeId`, {storeId: '@storeId'}, {
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
    events: $resource(`${api}/events/:eventId`, {eventId: '@eventId'}, {
      query: {
        method:'GET',
        isArray: false,
        withCredentials: true,
        headers:  {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    })
  }
}]);
