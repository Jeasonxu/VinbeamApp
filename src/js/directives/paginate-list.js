
let paginateTable = () => {
  var controller = ["$scope", () => {
    let vm = this;

    vm.displaydata = [];

    for(let prop in vm.datasource) {
      vm.displaydata.push(vm.datasource[prop]);
    }
  }];

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      datasource: '=',
    },
    controller: controller,
    controllerAs: 'vm',
    bindToController: true,
    templateUrl: '../../html/directiveTemplates/paginateTable.html'
  }
}

app.directive('paginateTable', paginateTable)
