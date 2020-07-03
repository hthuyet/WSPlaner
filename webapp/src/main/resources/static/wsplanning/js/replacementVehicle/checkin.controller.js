UserWebApp.controller('ReplacementCheckInCtrl', function ($scope, $rootScope, $locale, HttpService, $translate, $location, $state, $filter, $uibModal, $timeout, CommonServices) {
  loadCommon();
  $scope.params = {
    "from": "",
    "to": "",
  };

  $scope.lstGroup = [];
  $scope.lstVehicle = [];
  $scope.carChoosed = null;

  $scope.fuelList = [
    { "Id": "01", "Name": "1/4" },
    { "Id": "02", "Name": "2/4" },
    { "Id": "03", "Name": "3/4" },
    { "Id": "04", "Name": "4/4" },
      ];
  $scope.attachmentTypes = [
      { "Id": "LIC", "Name": "Driver License" },
      { "Id": "CCVEHI", "Name": "Vehicle Picture" }
    ];

  function loadCommon() {
    // HttpService.getData("/site/getByCommand/getCourtesyCarGroups", {}).then(function (response) {
    //   $scope.lstGroup = response;
    //   common.spinner(false);
    // }, function error(response) {
    //   console.log(response);
    //   common.spinner(false);
    // });

    HttpService.getData("/site/listByCommand", {}).then(function (response) {
      console.log("-----------listByCommand-------");
      console.log(response);
      $scope.lstGroup = response.getCourtesyCarGroups;
      common.spinner(false);
    }, function error(response) {
      console.log(response);
      common.spinner(false);
    });
  }

  $scope.VehiId = 0;
  $scope.template = "1";
  $scope.color = "green";

  //<editor-fold desc="onChangeGroup">
  $scope.onChangeGroup = function(){
    $scope.carChoosed = null;
    bindingData();
    console.log("---------------onChangeGroup: " + $scope.WorkOrder.group);
    HttpService.getData("/courtesyCar/getCCResByVehicle?group=" + $scope.WorkOrder.group, {}).then(function (response) {
      $scope.lstVehicle = response;
      common.spinner(false);
    }, function error(response) {
      console.log(response);
      $scope.lstVehicle = [];
      common.spinner(false);
    });

  }
  //</editor-fold>


  //<editor-fold desc="onChangeVehicle">
  function bindingData() {
    if (!$scope.carChoosed) {
      $scope.WorkOrder.WorkOrderNo = "";
      $scope.params.from = new Date();
      $scope.params.to = new Date();
      $scope.WorkOrder.Mileage = "";
      $scope.WorkOrder.checkinRemark = "";
      $scope.WorkOrder.checkinRemark = "";
    }else{
      $scope.WorkOrder.WorkOrderNo = $scope.carChoosed.WorkOrderNo;
      $scope.params.from = new Date($scope.carChoosed.ReservationFrom);
      $scope.params.to = new Date($scope.carChoosed.ReservationTo);
      if ($scope.WorkOrder.action == "checkin") {
        console.log("----checkin return-----");
        $scope.WorkOrder.Mileage = $scope.carChoosed.ReturnMileage;
        $scope.WorkOrder.checkinRemark = $scope.carChoosed.ChargeId;
        $scope.WorkOrder.checkinRemark = $scope.carChoosed.ReturnNote;
      } else if ($scope.WorkOrder.action == "checkout") {
        console.log("----checkout Delivery-----");
        $scope.WorkOrder.Mileage = $scope.carChoosed.DeliveryMileage;
        $scope.WorkOrder.Mileage = $scope.carChoosed.DeliveryFuelId;
        $scope.WorkOrder.checkinRemark = $scope.carChoosed.DeliveryNote;
      }
    }
  }

  $scope.changeAction = function(){
    console.log("--------changeAction: " + $scope.WorkOrder.action);
    bindingData();
  }

  $scope.onChangeVehicle = function(){
    console.log("---------------onChangeVehicle: " + $scope.WorkOrder.vehicle);
    var params = {
      "dtFrom": moment($scope.params.from).format("YYYY.MM.DD"),
      "dtTo": moment($scope.params.to).format("YYYY.MM.DD")
    };
    HttpService.getData("/courtesyCar/getCCResByVehicle/" + $scope.WorkOrder.vehicle, params).then(function (response) {
      console.log(response);
      if(response && response.length > 0) {
        if(response.length > 1){
          $scope.chooseCar(response);
        }else {
          $scope.carChoosed = response[0];
          bindingData();
        }
      }
      common.spinner(false);
    }, function error(response) {
      console.log(response);
      common.spinner(false);
    });
  }
  //</editor-fold>

  //<editor-fold desc="getCCResByWO">
  $scope.getCCResByWO = function(){
    console.log("---------------getCCResByWO: " + $scope.WorkOrder.WorkOrderNo);
    HttpService.getData("/courtesyCar/getCCResByWO/" + $scope.WorkOrder.WorkOrderNo,{}).then(function (response) {
      console.log(response);
      common.spinner(false);
    }, function error(response) {
      console.log(response);
      common.spinner(false);
    });

  }
  //</editor-fold>



  //<editor-fold desc="changeAttType">
  $scope.templateMark = {};
  $scope.changeAttType = function () {
    console.log("-----changeAttType------");
    console.log($scope.WorkOrder);
    $scope.base64Encode = "";
    common.spinner(true);
    var url = '/storage/downloadVehicleAttachment/' + $scope.WorkOrder.vehicle + "/"+$scope.WorkOrder.attachmentType;

    if($scope.WorkOrder.attachmentType == 'LIC'){
      url = '/storage/downloadCustAttachment/' + $scope.WorkOrder.custId + "/"+$scope.WorkOrder.attachmentType;
    }
    HttpService.getData(url, {}).then(function (response) {
      console.log(response)
      if(response){
        $scope.imgTemplate = "data:image/png;base64," + response.imageData;
        $scope.templateMark = {
          "FileId": response.fileId,
          "FileName": response.fileName,
          "dataUrl": "data:image/png;base64," + response.imageData,
          "ImageData": response.imageData,
          "AttachType": response.attachType,
          "AttachTypeDescription": response.attachTypeDescription,
          "FileDescription": response.fileDescription,
        };
      }else{
        $scope.imgTemplate = "";
        $scope.templateMark = {
          "FileId": 0,
          "FileName": "",
          "dataUrl": "",
          "ImageData": "",
          "AttachType": "",
          "AttachTypeDescription": "",
          "FileDescription": "",
        };
      }

      common.spinner(false);
    }, function error(response) {
      $scope.imgTemplate = "";
      console.log(response);
      common.spinner(false);
    });
  }

  $scope.changeAttType();
  //</editor-fold>


  //Sign
  $scope.boundingBox = {
    "width": 720,
    "height": 336,
  };

  $scope.$watch("color", function (newValue, oldValue) {
    var modified = false;
    if (newValue != oldValue) {
      console.log(newValue);
      $timeout(function () {
        angular.element('#btnUpdateColor').triggerHandler('click');
      });
      modified = true;
    } else if (newValue != "green") {
      modified = true;
    } else {
      modified = false;
    }
    $scope.$emit('isSave', {
          modified: modified,
        }
    );
  });

  function createListWOAttachment() {
    var list = [];
    var i = 0;
    //template da danh dau
    var template = $scope.acceptTemplate();
    if (!template.isEmpty) {
      var templateMark = {};
      templateMark.FileId = 0;
      templateMark.FileName = "";
      templateMark.dataUrl = template.dataUrl;
      templateMark.ImageData = template.dataUrl.replace("data:image/png;base64,", "");
      templateMark.AttachType = $scope.WorkOrder.attachmentType;
      templateMark.AttachTypeDescription = "";
      templateMark.FileDescription = "";
      list[i++] = templateMark;
    }else{
      if($scope.imgTemplate){
        list[i++] = $scope.templateMark;
      }
    }

    var signCanvas = $scope.accept();
    if (!signCanvas.isEmpty) {
      var sign = {};
      sign.FileId = 0;
      sign.FileName = "Signature_of_customer.png";
      sign.dataUrl = signCanvas.dataUrl;
      sign.ImageData = signCanvas.dataUrl.replace("data:image/png;base64,", "");
      sign.AttachType = "SIGNATUREP";
      sign.AttachTypeDescription = "";
      sign.FileDescription = "";
      list[i++] = sign;
    }

    if ($scope.listImage && $scope.listImage.length > 0) {
      Array.prototype.push.apply(list, $scope.listImage);
    }

    return list;
  }

  $scope.onSubmitForm = function (params) {

    console.log("-----onSubmitForm---");
    console.log($scope.WorkOrder);
    var list = createListWOAttachment();

    console.log(list);

    // common.btnLoading($(".btnSubmit"), true);
    // WorkOrderService.postWorkOrder(data, postAction).then(function (res) {
    //   common.btnLoading($(".btnSubmit"), false);
    //   console.log(res);
    //   if (res.data.Token && res.data.Token.ErrorDesc) {
    //     common.notifyWithMessage("Warning!!!", res.status, res.data.Token.ErrorDesc)
    //   } else {
    //     common.notifySuccess("Success!!!");
    //   }
    //   console.log($scope.WorkOrder);
    //
    //   if (params) {
    //     $scope.$emit('isSave', {
    //
    //           modified: false,
    //         }
    //     );
    //     console.log(params);
    //     console.log($state.current);
    //     $state.transitionTo($state.current, params, {
    //       reload: false, inherit: false, notify: false, location: "replace"
    //     });
    //   } else {
    //     if ($scope.WorkOrder && $scope.WorkOrder.WorkOrderId) {
    //       location.reload();
    //     }
    //   }
    //
    // }, function (err) {
    //   common.btnLoading($(".btnSubmit"), true);
    //   console.log(err);
    //   common.notifyError("Error!!!", err.status);
    // });
  }


  //<editor-fold desc="openImage">
  $scope.listImage = [];
  $scope.openImage = function () {
    console.log("------openImage----");
    $scope.listImage = [];
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/wsplanning/templates/pages/common/photo-form.html',
      controller: 'PhotoModalCtrl',
      backdrop: 'static',
      controllerAs: '$ctrl',
      size: "full",
      resolve: {
        data: {
          item: null,
          workOrderId: 123,
          jobAttachments: null
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      console.log(selectedItem);
      Array.prototype.push.apply($scope.listImage, selectedItem);
      console.log($scope.listImage);
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };
  //</editor-fold>


  //<editor-fold desc="date picker">
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };


  $scope.openFromDate = function () {
    $rootScope.popupFromDate.opened = true;
  };

  $scope.openToDate = function () {
    $rootScope.popupToDate.opened = true;
  };


  $rootScope.popupFromDate = {
    opened: false
  };

  $rootScope.popupToDate = {
    opened: false
  };
  //</editor-fold>


  //<editor-fold desc="Choose CCcars">
  $scope.chooseCar = function (listCars) {
    console.log("------chooseCar----");
    var modalChooseCar = $uibModal.open({
      animation: true,
      templateUrl: '/wsplanning/templates/pages/common/choose-car.html',
      controller: 'ChooseCarModalCtrl',
      controllerAs: '$ctrl',
      size: "full",
      resolve: {
        listCars: function () {
          return listCars;
        },
        title: function () {
          return "Choose Car";
        }
      }
    });

    modalChooseCar.result.then(function (value) {
      if (value) {
        console.log(value);
        $scope.carChoosed = value;
        bindingData();
      }
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  }
  //</editor-fold>


});

UserWebApp.controller('ChooseCarModalCtrl', function ($scope, $rootScope, $timeout,
                                                    $state, $uibModal, $uibModalInstance, CommonServices,
                                                      listCars, title) {

  var type = '';
  var $ctrl = this;

  $scope.listCars = listCars;
  $scope.title = title;

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.doPick = function (selectedItem) {
    $uibModalInstance.close(selectedItem);
  }

})