UserWebApp.controller('ReplacementVehicleCtrl', function ($scope, $rootScope, $locale, HttpService, $translate, $location, $state, $filter,
                                                          $uibModal, CommonServices, workOrderNo) {
  loadCommon();
  $scope.lstGroup = [];
  $scope.lstVehicle = [];
  $scope.WorkOrder = {
    "WorkOrderId": "",
    "WorkOrderNo": workOrderNo,
    "group": "",
    "vehicle": "",
    "custId": "",
    "Mileage": "",
    "fuel": "",
    "checkinRemark": "",
    "attachmentType": "",
    "action": "",
    "actionDisable": true,
    "CustNo": "",
    "FName": "",
    "LName": ""
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