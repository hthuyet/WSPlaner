UserWebApp.controller('ReplacementCheckInCtrl', function ($scope, $rootScope, $locale, HttpService, $translate, $location, $state, $filter, $uibModal, CommonServices) {
  loadCommon();
  $scope.lstGroup = [];
  $scope.lstVehicle = [];
  $scope.WorkOrder = {
    "wo": "",
    "group": "",
    "vehicle": "",
  };

  function loadCommon() {
    CommonServices.getTransactionTypes().then(function (data) {
      $scope.lstTrans = data;
    });wokOrderClient
    CommonServices.getDepartments().then(function (data) {
      $scope.lstDepartment = data;
    });
  }


});