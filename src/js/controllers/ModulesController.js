
app.controller('ModulesController', ['$scope', '$window', 'VinbeamService', ($scope, $window, VinbeamService) => {

  let modules;
  let page_size = 8;
  $scope.displayModules = [];
  $scope.activeModules = 0
  $scope.inactiveModules = 0;
  $scope.selectedModule;
  $scope.page_num;
  $scope.start = 0;
  $scope.currentPage = 1;


  ($scope.getModules = () => {
    VinbeamService.modules.query().$promise.then(res => {
      modules = res._embedded.modules;
      $scope.selectedModule = modules[0];
      makeMap($scope.selectedModule);
      sortActive();
      $scope.page_num = Math.ceil(modules.length / page_size);
      paginate();
    })
  })();

  let makeMap = (module) => {
    if(document.getElementById('module_map')){
      let useragent = navigator.userAgent;
      let mapdiv = document.getElementById("module_map");

      let myLatlng = new google.maps.LatLng(module.currentPosition.latitude, module.currentPosition.longitude);
      let mapOptions = {
        zoom: 8,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      let map = new google.maps.Map(mapdiv, mapOptions);

      let marker = new google.maps.Marker({
          position: myLatlng,
          title:"Module Location"
      });

      marker.setMap(map);
    }
  }

  function paginate(){
    let modules_clone = modules.slice(0);
    $scope.displayModules = modules_clone.splice($scope.start, ($scope.start + page_size));
  }

  function sortActive(){
    modules.forEach((module, i) => {
      module.info.active ? $scope.activeModules++ : $scope.inactiveModules++;
    })
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

  $scope.displayModule = (module) => {
    $scope.selectedModule = module;
    makeMap($scope.selectedModule);
  }
}])
