
app.controller('EventsController', ['$scope', '$window', 'VinbeamService', ($scope, $window, VinbeamService) => {
  VinbeamService.events.query().$promise.then((res) => {
    console.log(res);
  })

}])
