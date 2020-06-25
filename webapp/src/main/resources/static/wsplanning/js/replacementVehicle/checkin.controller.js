UserWebApp.controller('ReplacementCheckInCtrl', function ($scope, $rootScope, $locale, HttpService, $translate, $location, $state, $filter, $uibModal, CommonServices) {
  loadCommon();
  $scope.lstGroup = [];
  $scope.lstVehicle = [];
  $scope.WorkOrder = {
    "wo": "",
    "group": "",
    "vehicle": "500372",
    "custId": "500372",
    "attachmentType": "CCVEHI"
  };

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
    CommonServices.getTransactionTypes().then(function (data) {
      $scope.lstTrans = data;
    });
    CommonServices.getDepartments().then(function (data) {
      $scope.lstDepartment = data;
    });
  }

  $scope.VehiId = 0;
  $scope.template = "1";
  $scope.templateSelected = { "Id": "01" };
  $scope.templateName = {};
  $scope.lstTemplate = [];
  $scope.color = "green";

  //<editor-fold desc="listTemplateType">
  $scope.listTemplateType = function () {
    $scope.base64Encode = "";
    common.spinner(true);
    HttpService.postDataWithCache('/checkin/template-type', { VehiId: $scope.VehiId }).then(function (response) {
      $scope.lstTemplate = response;
      if ($scope.lstTemplate.length > 0) {
        $scope.templateSelected = $scope.lstTemplate[0];
      }
      $scope.templateSelected = {};
      $scope.data.legalText = "";
      $scope.templateName = "";
      $scope.changeTemplate();
      common.spinner(false);
    }, function error(response) {
      $scope.lstTemplate = [];
      $scope.templateSelected = {};
      $scope.data.legalText = "";
      $scope.templateName = "";
      $scope.changeTemplate();
      console.log(response);
      common.spinner(false);
    });
  }
  $scope.listTemplateType();
  //</editor-fold>

  //<editor-fold desc="changeAttType">
  $scope.changeAttType = function () {
    console.log($scope.WorkOrder);
    $scope.base64Encode = "";
    common.spinner(true);
    var url = '/courtesyCar/downloadVehicleAttachment/' + $scope.WorkOrder.vehicle + "/"+$scope.WorkOrder.attachmentType;

    if($scope.WorkOrder.attachmentType == 'LIC'){
      url = '/courtesyCar/downloadCustAttachment/' + $scope.WorkOrder.custId + "/"+$scope.WorkOrder.attachmentType;
    }
    HttpService.postData(url, {}).then(function (response) {
      console.log(response)
      $scope.imgTemplate = "data:image/png;base64," + response.base64;
      common.spinner(false);
    }, function error(response) {
      $scope.imgTemplate = "";
      console.log(response);
      common.spinner(false);
    });
  }
  //</editor-fold>


  //Sign
  $scope.boundingBox = {
    "width": 900,
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
      templateMark.FileName = $scope.templateName;
      templateMark.dataUrl = template.dataUrl;
      templateMark.ImageData = template.dataUrl.replace("data:image/png;base64,", "");
      templateMark.AttachType = "VHC";
      templateMark.AttachTypeDescription = "";
      templateMark.FileDescription = "";
      list[i++] = templateMark;
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
    var list = createListWOAttachment();

    console.log(list);

    common.btnLoading($(".btnSubmit"), true);
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

});