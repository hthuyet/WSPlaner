UserWebApp.controller('CustomerCtrl', function ($scope, $rootScope, HttpService, $translate, $location, $filter, $uibModal, CommonServices, $stateParams, $state) {
  $scope.WorkOrderId = $stateParams.id;
  $scope.type = $stateParams.type;

  $scope.isShow = false;

  $scope.WOCustomer = {};

  if ($scope.WorkOrder) {
    $scope.WOCustomer = $scope.WorkOrder.WOCustomer;
  }

  $scope.toogleVehicle = function () {
    $scope.isShow = !$scope.isShow;
    console.log($scope.WOCustomer);
  }


  var $ctrl = this;
  $ctrl.animationsEnabled = true;

  $scope.searchVehicle = function (item) {
    console.log("----open--------");
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/workdetail/modal/search_vehicle.html',
      controller: 'SearchVehicleModalCtrl',
      controllerAs: '$ctrl',
      size: "full",
      resolve: {
        item: function () {
          return item;
        }
      }
    });

    modalInstance.rendered.then(function () {
      $rootScope.$broadcast("openSearchVehicle", {});
    });

    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  $rootScope.$on('chooseCustomer', function (event, obj) {
    $scope.WOCustomer = obj.item;
    $scope.WorkOrder.WOCustomer = $scope.WOCustomer;
  });

  
  $rootScope.$on('choosePayerCustomer', function (event, obj) {
    $scope.WOCustomer = obj.item;
    // $scope.WOContract = obj.item;
    $scope.WorkOrder.WOCustomer = $scope.WOCustomer;
    // $scope.WorkOrder.WOContract = $scope.WOCustomer;
    
    console.log(obj);
  });

});