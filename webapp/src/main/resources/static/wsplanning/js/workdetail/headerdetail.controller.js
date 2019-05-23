UserWebApp.controller('HeaderDetailCtrl', function ($scope, $rootScope, WorkOrderService, HttpService, $translate, $location, $filter, $uibModal, CommonServices, $stateParams, $state) {
  $scope.WorkOrderId = $stateParams.id;
  $scope.type = $stateParams.type;

  $scope.actTypeHeader = $scope.$parent.actionType;


  //DATETIME PICKER
  var that = this;

  $scope.isOpenServiceDate = false;
  $scope.ServiceDate = new Date();

  $scope.openServiceDate = function (e) {
    e.preventDefault();
    e.stopPropagation();
    $scope.isOpenServiceDate = true;
  };


  $scope.isOpenCheckOutDate = false;
  $scope.openCheckOutDate = function (e) {
    e.preventDefault();
    e.stopPropagation();
    $scope.isOpenCheckOutDate = true;
  };

  $scope.isOpenCheckInDate = false;
  $scope.openCheckInDate = function (e) {
    e.preventDefault();
    e.stopPropagation();
    $scope.isOpenCheckInDate = true;
  };

  $scope.isOpenExecutionDate = false;
  $scope.openExecutionDate = function (e) {
    e.preventDefault();
    e.stopPropagation();
    $scope.isOpenExecutionDate = true;
  };


  $scope.pristine = false;


  var firstVehicle = {};
  var firstCustomer = {};
  var firstContact = {};

  firstVehicle = Object.assign(firstVehicle, $scope.WorkOrder.WOVehicle);
  // console.log(firstVehicle);
  firstCustomer = Object.assign(firstCustomer, $scope.WorkOrder.WOCustomer);
  firstContact = Object.assign(firstContact, $scope.WorkOrder.WOContact);

  $scope.$watch('WorkOrder.WOVehicle', function (newValue, oldValue) {
    if (newValue && newValue.LicenseNo) {
      if (newValue.LicenseNo !== firstVehicle.LicenseNo) {
        $scope.pristine = true;
      } else {
        $scope.pristine = false;
      }
    }
  });

  $scope.$watch('WorkOrder.WOCustomer', function (newValue, oldValue) {
    if (newValue && newValue.CustNo) {
      if (newValue.CustNo !== firstCustomer.CustNo) {
        $scope.pristine = true;
      } else {
        if ($scope.WorkOrder.WOVehicle.LicenseNo === firstVehicle.LicenseNo) {
          $scope.pristine = false;
        } else {
          $scope.pristine = true;
        }
      }
    }
  });

  $scope.$watch('WorkOrder.WOContact', function (newValue, oldValue) {
    if (newValue && newValue.CustNo) {
      if (newValue.CustNo !== firstContact.CustNo) {
        $scope.pristine = true;
      } else {
        if ($scope.WorkOrder.WOVehicle.LicenseNo === firstVehicle.LicenseNo) {
          $scope.pristine = false;
        } else {
          $scope.pristine = true;
        }
      }
    }
  });


  //if the form is modified => using $emit to send data
  $scope.$on('inputModified.formChanged', function (event, modified, formCtrl) {

    $scope.$emit("headerData", {
      data: $scope.WorkOrder,
      modified: modified,
    }
    );
  });

  //get jobdata
  var jobData = {}
  $rootScope.$on("jobData", function (evt, obj) {
    jobData = obj;
    // console.log(obj);
  });


  $scope.onSubmitForm = function (params) {
    console.log("----onSubmitForm-----" + $scope.actTypeHeader);

    var data = JSON.stringify($scope.WorkOrder);
    var postAction = "";
    if ($scope.actTypeHeader === "new") {
      postAction = "createNew";

      //save job - after save header
      //$scope.WorkOrder = jobData.data;

      var data = JSON.stringify(jobData.data);

      common.btnLoading($(".btnSubmit"), true);
      WorkOrderService.postWorkOrder(data, postAction).then(function (res) {
        common.btnLoading($(".btnSubmit"), false);
        console.log(res);
        if (res.data.Token && res.data.Token.ErrorDesc) {
          common.notifyWithMessage("Warning!!!", res.status, res.data.Token.ErrorDesc)
        } else {
          common.notifySuccess("Success!!!");
        }
        if (params) {
          if (params.id) {
            $state.transitionTo($state.current, params, {
              reload: false, inherit: false, notify: false, location: "replace"
            });
          } else {
            $state.go('app.main.workdetail', { 'id': res.data.WorkOrderId, 'type': $stateParams.type });
          }
        } else {
          $state.go('app.main.workdetail', { 'id': res.data.WorkOrderId, 'type': $stateParams.type });
        }
        // $state.go('app.main.workdetail', { 'id': res.data.WorkOrderId , 'type': $stateParams.type });


      }, function (err) {
        common.btnLoading($(".btnSubmit"), false);
        console.log(err);
        common.notifyError("Error!!!", err.status);
      });



    } else {
      postAction = "saveHeader";

      common.btnLoading($(".btnSubmit"), true);
      WorkOrderService.postWorkOrder(data, postAction).then(function (res) {
        common.btnLoading($(".btnSubmit"), false);
        console.log("------1--------");
        if (res.data.Token && res.data.Token.ErrorDesc) {
          common.notifyWithMessage("Warning!!!", res.status, res.data.Token.ErrorDesc);
        } else {
          common.notifySuccess("Success!!!");
        }

        console.log("------2-------");
        console.log(params);
        if (params) {
          console.log("------3-------");
          $state.transitionTo($state.current, params, {
            reload: true, inherit: true, notify: true, location: "replace"
          });
        } else {
          console.log("------4-------");
          $state.go('app.main.workdetail', { 'id': res.data.WorkOrderId, 'type': $stateParams.type });
        }
        // $state.go('app.main.workdetail', { 'id': res.data.WorkOrderId , 'type': $stateParams.type });

      }, function (err) {
        common.btnLoading($(".btnSubmit"), false);
        console.log(err);
        common.notifyError("Error!!!", err.status);
      })

    }
  }

  //Save from button header
  $scope.$on('saveHeader', function (event, obj) {
    $scope.onSubmitForm(obj.item);
  });

  $scope.afterRender = function () {
    console.log("afterRender");
    $rootScope.WorkOrderOrg = angular.copy($scope.WorkOrder);
  }


});