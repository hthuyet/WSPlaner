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

  //<editor-fold desc="changeTemplate">
  $scope.changeTemplate = function () {
    console.log($scope.templateSelected);

    $scope.templateName = "";
    if ($scope.templateSelected && $scope.templateSelected.Items && $scope.templateSelected.Items.length > 0) {
      for (var i = 0; i < $scope.templateSelected.Items.length; i++) {
        if ($scope.templateSelected.Items[i].Id == "Image") {
          $scope.templateName = $scope.templateSelected.Items[i].Value;
        }
      }
    }
    $scope.base64Encode = "";
    common.spinner(true);
    if ($scope.templateName != "") {
      HttpService.postData('/checkin/template', { name: $scope.templateName }).then(function (response) {
        console.log(response)
        $scope.imgTemplate = "data:image/png;base64," + response.base64;
        common.spinner(false);
      }, function error(response) {
        $scope.imgTemplate = "";
        console.log(response);
        common.spinner(false);
      });
    } else {
      // HttpService.postData('/checkin/template', {type: $scope.template}).then(function (response) {
      //     $scope.imgTemplate = "data:image/png;base64," + response.base64;
      //     common.spinner(false);
      // }, function error(response) {
      //     $scope.imgTemplate = "";
      //     console.log(response);
      //     common.spinner(false);
      // });
    }
  }
  //</editor-fold>


  //Sign
  $scope.boundingBox = {
    "width": 900,
    "height": 336,
  };


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