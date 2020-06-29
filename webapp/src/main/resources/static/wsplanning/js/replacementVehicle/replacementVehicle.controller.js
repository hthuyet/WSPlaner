UserWebApp.controller('ReplacementVehicleCtrl', function ($scope, $rootScope, $locale, HttpService, $translate, $location, $state, $filter, $uibModal, CommonServices) {
  loadCommon();
  $scope.lstGroup = [];
  $scope.lstVehicle = [];
  $scope.WorkOrder = {
    "WorkOrderNo": "",
    "group": "",
    "vehicle": "8329",
    "custId": "8329",
    "Mileage": "500",
    "fuel": "02",
    "checkinRemark": "checkinRemark",
    "attachmentType": "CCVEHI",
    "action": "checkout"
  };

  $scope.actionList = [{
    "action": "checkin",
    "name": "checkin"
  }, {
    "action": "checkout",
    "name": "checkout"
  }];
  $scope.action = "checkout";

  function loadCommon() {
    CommonServices.getCourtesyCarGroups().then(function (data) {
      $scope.lstGroup = data;
    });
  }


});