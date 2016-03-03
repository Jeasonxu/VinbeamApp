
app.controller('VehiclesController', ['$scope', '$window', 'VinbeamService', ($scope, $window, VinbeamService) => {

  let vehicles;
  let page_size = 8;
  $scope.displayVehicles = [];
  $scope.selectedVehicle;
  $scope.page_num;
  $scope.start = 0;
  $scope.currentPage = 1;


  ($scope.init = () => {
    VinbeamService.stores.query().$promise.then(res => {
      $scope.stores = res._embedded.stores;
      console.log($scope.stores[0]);
    })
    VinbeamService.vehicles.query().$promise.then(res => {
      vehicles = res._embedded.vehicles;
      $scope.page_num = Math.ceil(vehicles.length / page_size);
      paginate();
    })
  })();

  function paginate(){
    let vehicles_clone = vehicles.slice(0);
    $scope.displayVehicles = vehicles_clone.splice($scope.start, ($scope.start + page_size));
  }


  $scope.nextPage = () => {
    $scope.start = $scope.start+=page_size;
    $scope.currentPage++;
    paginate();
  }

  $scope.previousPage = () => {
    $scope.start = $scope.start-=page_size;
    $scope.currentPage--;
    paginate();
  }

}])
