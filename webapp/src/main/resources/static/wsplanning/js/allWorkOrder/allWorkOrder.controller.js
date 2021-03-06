UserWebApp.controller('AllWorkOrdersCtrl', function ($scope, $rootScope, $locale, HttpService, $translate, $timeout,$location, $state, $filter, $uibModal, CommonServices, typeWO, $cookies) {
  $scope.typeWO = typeWO;
  
  var EmployeeData = $("#EmployeeData").data("employee");
  $scope.lstAllData = [];
  $scope.lstData = [];
  $scope.lstSearch = [];
  $scope.totalElements = 0;
  $scope.lstbtnCommon = JSON.parse(localStorage.getItem('info_common'));
  // $scope.params = {
  //   "department": "300",
  //   "trans": "W",
  //   "visitReason": "03",
  //   "serv": "",
  // };

  $scope.buttonType = function (name) {
    var string = "app.main." + name;
    $state.go(string, {'locale': $rootScope.lang, 'type': $scope.typeWO, 'action': name });
  }

  $scope.params = {
    "department": EmployeeData.DeptId,
    "trans": "",
    "visitReason": "",
    "receiver": "",
    "from": "",
    "to": "",
    "myWo": false,
    "shiftId": EmployeeData.ShiftId,
    "skey": "",
    "SubStatus": ""
  };

  $scope.limit = 20;
  $scope.page = 1;

  function reset() {
    $scope.params = {
      "department": EmployeeData.DeptId,
      "trans": "",
      "visitReason": "",
      "receiver": "",
      "from": "",
      "to": "",
      "myWo": false,
      "shiftId": EmployeeData.ShiftId,
      "skey": "",
      "SubStatus": "",
    };
    $scope.limit = 20;
    $scope.page = 1;
  }

  // datepicker-vutt

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

  loadCommon();
  $scope.lstTrans = [];
  $scope.lstDepartment = [];
  $scope.lstServ = [];
  $scope.lstVisitReason = [];
  $scope.lstShift = [];
  $scope.lstSubStatuses = [];

  function loadCommon() {
    CommonServices.getTransactionTypes().then(function (data) {
      $scope.lstTrans = data;
    });
    CommonServices.getDepartments().then(function (data) {
      $scope.lstDepartment = data;
    });
    CommonServices.getVisitReasons().then(function (data) {
      $scope.lstVisitReason = data;
      // console.log(data)
    });
    CommonServices.getServiceAdvisors().then(function (data) {
      $scope.lstServ = data;
    });
    CommonServices.getShifts().then(function (data) {
      $scope.lstShift = data;
    });

    CommonServices.getSubStatuses().then(function (data) {
      $scope.lstSubStatuses = data;
    });

    //Fill from cookies
    var dataCookie = $cookies.get("searchCookies", JSON.stringify($scope.params));
    // console.log("dataCookie: " + dataCookie);
    if(dataCookie){
      var dataCookieObj = JSON.parse(dataCookie);
      //Remove Cookies except the text search field (the first field: Search workorders)
      $scope.params.skey = "";
      $scope.params.trans = dataCookieObj.trans;
      $scope.params.visitReason = dataCookieObj.visitReason;
      $scope.params.shiftId = dataCookieObj.shiftId;
      $scope.params.receiver = dataCookieObj.receiver;
      $scope.params.myWo = dataCookieObj.myWo;
      if(dataCookieObj.from){
        $scope.params.from = new Date(dataCookieObj.from);
      }
      if(dataCookieObj.to){
        $scope.params.to = new Date(dataCookieObj.to);
      }
      $scope.params.SubStatus = dataCookieObj.SubStatus;
    }

  }

  function loadData(count) {
    common.spinner(true);
    //unScheduledWO, withSubcontractor, todayWO, allWO, withMOT, withTire, withBO, postponedWO, offers

    var params = {
      "ViewName": $scope.typeWO,
      "skey": $scope.params.skey,
      "page": $scope.page,
      "limit": $scope.limit,
      "DeptId": $scope.params.department,
      "TransactionType": $scope.params.trans,
      "VisitReasonCode": $scope.params.visitReason,
      "ShiftId": $scope.params.shiftId,
      "Receiver": $scope.params.receiver,
      "MyWO": $scope.params.myWo,
      "FromDate": $scope.params.from,
      "ToDate": $scope.params.to,
      "SubStatus": $scope.params.SubStatus,
    };

    //Save to cookies
    $cookies.put("searchCookies", JSON.stringify($scope.params));

    HttpService.postData('/wo/getWO', params).then(function (response) {
      $scope.lstData = response;
      console.log(response)
      $scope.pageGo = $scope.page;
      $scope.isShow = false;
      common.spinner(false);
    }, function error(response) {
      console.log(response);
      common.spinner(false);
    });

    //  HttpService.postData('/wo/getWorkOrdersByView', params).then(function (response) {
    //   $scope.lstData = response;
    //   console.log(response)
    //   $scope.pageGo = $scope.page;
    //   $scope.isShow = false;
    //   common.spinner(false);
    // }, function error(response) {
    //   console.log(response);
    //   common.spinner(false);
    // });

    if (count) {
      HttpService.postData('/wo/countWO', params).then(function (response) {
        $scope.totalElements = response;
        $scope.isNoData = ($scope.totalElements <= 0);
        common.spinner(false);
      }, function error(response) {
        console.log(response);
        common.spinner(false);
      });
    }
  }

  loadData(true);

  //<editor-fold desc="Paging & Search Port">
  $scope.$watch("page", function (newValue, oldValue) {
    if (newValue != oldValue) {
      $scope.page = newValue;
      loadData();
    }
  });

  $scope.go = function () {
    $scope.page = $scope.pageGo;
  }

  $scope.changeLimit = function () {
    loadData(false);
  }
  $scope.doSearch = function () {
    $scope.page = 1;
    $scope.pageGo = 1;
    loadData(true);
  }
  //</editor-fold>

  $scope.onRefresh = function () {
    $scope.limit = '20';
    $scope.page = '1';
    $scope.name = '';

    loadData(true);
    common.btnLoading($('.btnRefresh'), true);
    setTimeout(function () {
      common.btnLoading($('.btnRefresh'), false);
    }, 1000);
  };

  $scope.addItem = function () {
    $('#modalFrm').modal('show');
    $rootScope.$broadcast("modalFrm", { "item": {} });
  }

  $scope.editItem = function (item) {
    $('#modalFrm').modal('show');
    $rootScope.$broadcast("modalFrm", { "item": angular.copy(item, {}) });
  }

  //Modal
  var $ctrl = this;
  $ctrl.animationsEnabled = true;

  $ctrl.open = function (size, item) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/allWorkOrder/modal-form.html',
      controller: 'AllWorkOrderModalCtrl',
      controllerAs: '$ctrl',
      size: size,
      resolve: {
        item: function () {
          return item;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };


  //function viewDetail
  $scope.viewDetail = function (item) {
    $timeout(function() {
      $state.go('app.main.workdetail', {
        'locale': $rootScope.lang,
        'id': item.WorkOrderId,
        'type': $scope.typeWO,
        'tab': 'job'
      });
    });
  }

  $scope.onRefresh = function () {
    $state.reload();
  }

  $scope.isShow = false;
  $scope.toogleSearch = function () {
    $scope.isShow = !$scope.isShow;
  }

  $scope.resetSearch = function () {
    $scope.params = {
      "department": EmployeeData.DeptId,
      "trans": "",
      "visitReason": "",
      "receiver": "",
      "from": "",
      "to": "",
      "myWo": false,
      "shiftId": EmployeeData.ShiftId,
      "skey": "",
      "SubStatus": "",
    };
    $scope.page = 1;
    $scope.pageGo = 1;
    loadData(true);
  }

  //openCamera
  $scope.openCamera = function () {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/scan_barcode.html',
      controller: 'ScanBarcodeModalCtrl',
      controllerAs: '$ctrl',
      size: "full",
      resolve: {

      }
    });

    modalInstance.rendered.then(function () {
      $rootScope.$broadcast("modalOpen", {});
    });

    modalInstance.result.then(function (value) {
      if (value) {
        $scope.params.skey = value;
        $scope.doSearch();
      }
    }, function () {
      if (Quagga){
        Quagga.stop();
      }
      console.log('Modal dismissed at: ' + new Date());
    });
  }


  $scope.openQRCode = function () {
    console.log("----openQRCode----");
    Instascan.Camera.getCameras().then(function (cameras) {

      var modalInstance = $uibModal.open({
        animation: $ctrl.animationsEnabled,
        templateUrl: '/wsplanning/templates/pages/scan_qrcode.html',
        controller: 'ScanQRcodeModalCtrl',
        controllerAs: '$ctrl',
        size: "lg",
        resolve: {
          cameras: function () {
            return cameras;
          }
        }
      });

      modalInstance.rendered.then(function () {
        $rootScope.$broadcast("modalOpenQR", {});
      });

      modalInstance.result.then(function (obj) {
        if(obj.scanner){
          obj.scanner.stop();
        }

        if (obj.code) {
          $scope.params.skey = obj.code;
          console.log("------------$scope.params.skey: " + $scope.params.skey);
          $scope.doSearch();
        }
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

    }).catch(function (e) {
      common.notifyError("Cannot init camera!")
      console.error(e);
    });

  }

});


// Modal controller

UserWebApp.controller('AllWorkOrderModalCtrl', function ($scope, $rootScope, HttpService, $translate, $location, $filter, $uibModal, $uibModalInstance, item) {

  var $ctrl = this;
  $ctrl.item = item;
  $ctrl.selected = item;

  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});

//end