UserWebApp.controller('GridWorkOrderCtrl', function ($scope, $rootScope, $locale, HttpService, $translate, $timeout,$location, $state, $filter, $uibModal, CommonServices, listField) {
  $scope.typeWO = "allWO";
  $scope.listField = listField;
  $scope.sortable = {
    name: "",
    direction: "",
  };


  var EmployeeData = $("#EmployeeData").data("employee");

  $scope.lstAllData = [];
  $scope.lstData = [];
  $scope.lstSearch = [];
  $scope.totalElements = 0;
  $scope.lstbtnCommon = JSON.parse(localStorage.getItem('info_common'));

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


  //


  loadCommon();
  $scope.lstTrans = [];
  $scope.lstDepartment = [];
  $scope.lstServ = [];
  $scope.lstVisitReason = [];
  $scope.lstShift = [];

  function loadCommon() {
    CommonServices.getTransactionTypes().then(function (data) {
      $scope.lstTrans = data;
    });
    CommonServices.getDepartments().then(function (data) {
      $scope.lstDepartment = data;
    });
    CommonServices.getVisitReasons().then(function (data) {
      $scope.lstVisitReason = data;
    });
    CommonServices.getServiceAdvisors().then(function (data) {
      $scope.lstServ = data;
    });
    CommonServices.getShifts().then(function (data) {
      $scope.lstShift = data;
    });
  }

  function loadData(count) {
    common.spinner(true);
    //unScheduledWO, withSubcontractor, todayWO, allWO, withMOT, withTire, withBO, postponedWO, offers

    var params = {
      "ViewName": "GRIDVIEW",
      "skey": $scope.params.skey,
      "page": $scope.page,
      "limit": $scope.limit,
      "DeptId": $scope.params.department,
      "TransactionType": $scope.params.trans,
      "VisitReasonCode": $scope.params.visitReason,
      "shiftId": $scope.params.shiftId,
      "Receiver": $scope.params.receiver,
      "MyWO": $scope.params.myWo,
      "FromDate": $scope.params.from,
      "ToDate": $scope.params.to,
      "SortByField": $scope.sortable.name,
      "SortDesc": $scope.sortable.direction,
    };

    HttpService.postData('/wo/getGridWO', params).then(function (response) {
      $scope.lstData = response;
      $scope.pageGo = $scope.page;
      $scope.isShow = false;
      common.spinner(false);
    }, function error(response) {
      console.log(response);
      common.spinner(false);
    });

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

  $scope.sort = function(field){
    if(field == $scope.sortable.name){
      if($scope.sortable.direction == "desc"){
        $scope.sortable.direction = "asc";
      }else{
        $scope.sortable.direction = "desc";
      }
    }else{
      $scope.sortable = {
        name: field,
        direction: "desc",
      };
    }
    loadData(false);
  }

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

  //function viewDetail
  $scope.viewDetail = function (item) {
    $timeout(function() {
      $state.go('app.main.workdetail', {
        'locale': $rootScope.lang,
        'id': item.WorkOrderId,
        'type': typeWO,
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
    $scope.sortable = {
      name: "",
      direction: "",
    };


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
        console.log(obj);

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


  //Filter
  $scope.XLfilters = { list: [], dict: {}, results: [] };
  $scope.markAll = function(field, b) {
    $scope.XLfilters.dict[field].list.forEach((x) => {x.checked=b;});
  }
  $scope.clearAll = function(field) {
    $scope.XLfilters.dict[field].searchText='';
    $scope.XLfilters.dict[field].list.forEach((x) => {x.checked=true;});
  }
  $scope.XLfiltrate = function() {
    var i,j,k,selected,blocks,filter,option, data=$scope.XLfilters.all,filters=$scope.XLfilters.list;
    $scope.XLfilters.results=[];
    for (j=0; j<filters.length; j++) {
      filter=filters[j];
      filter.regex = filter.searchText.length?new RegExp(filter.searchText, 'i'):false;
      for(k=0,selected=0;k<filter.list.length;k++){
        if(!filter.list[k].checked) selected++;
        filter.list[k].visible=false;
        filter.list[k].match=filter.regex?filter.list[k].title.match(filter.regex):true;
      }
      filter.isActive=filter.searchText.length>0||selected>0;
    }
    for (i=0; i<data.length; i++){
      blocks={allows:[],rejects:[],mismatch:false};
      for (j=0; j<filters.length; j++) {
        filter=filters[j]; option=filter.dict[data[i][filter.field]];
        (option.checked?blocks.allows:blocks.rejects).push(option);
        if(filter.regex && !option.match) blocks.mismatch=true;
      }
      if(blocks.rejects.length==1) blocks.rejects[0].visible=true;
      else if(blocks.rejects.length==0&&!blocks.mismatch){
        $scope.XLfilters.results.push(data[i]);
        blocks.allows.forEach((x)=>{x.visible=true});
      }
    }
    for (j=0; j<filters.length; j++) {
      filter=filters[j];filter.options=[];
      for(k=0;k<filter.list.length;k++){
        if(filter.list[k].visible && filter.list[k].match) filter.options.push(filter.list[k]);
      }
    }
  }
  function createXLfilters(arr, fields) {
    $scope.XLfilters.all = arr;
    for (var j=0; j<fields.length; j++) $scope.XLfilters.list.push($scope.XLfilters.dict[fields[j]]={list:[],dict:{},field:fields[j],searchText:"",active:false,options:[]});
    for (var i=0,z; i<arr.length; i++) for (j=0; j<fields.length; j++) {
      z=$scope.XLfilters.dict[fields[j]];
      z.dict[arr[i][fields[j]]] || z.list.push(z.dict[arr[i][fields[j]]]={title:arr[i][fields[j]],checked:true, visible:false,match:false});
    }
  }

  $scope.woStatus = [
    {"id":  "WorkOrderStatus","check": false},
    {"id":  "SubStatus","check": false},
  ];
  $scope.filters = {
    "WorkOrderStatus": {"isActive": false, "options": $scope.woStatus},
    "SubStatus": {"isActive": false, "options": $scope.woStatus},
  };

  $scope.checkChange = function(key){
    for(var i = 0;i<$scope.filters[key].options.length;i++){
      if($scope.filters[key].options[i].check === true){
        $scope.filters[key].isActive = true;
        break;
      }
    }
  }

  console.log($scope.listField);
});
