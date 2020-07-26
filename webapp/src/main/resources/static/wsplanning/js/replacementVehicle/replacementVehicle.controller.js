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
    "LName": "",
    "Disclaimer": "",
    "LicenseNo": "",
    "Make": "",
    "Model": "",
    "SubModel": ""
  };

  //checkin
  $scope.actionList = [{
    "action": "checkin",
    "name": $translate.instant('checkin')
  }, {
    "action": "checkout",
    "name": $translate.instant('checkout')
  }];
  $scope.action = "checkout";

  function loadCommon() {
    CommonServices.getCourtesyCarGroups().then(function (data) {
      $scope.lstGroup = data;
    });
  }


});