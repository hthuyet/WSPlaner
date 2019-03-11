UserWebApp.controller('JobDetailCtrl', function ($scope, $rootScope, WorkOrderService, HttpService, $translate, $location, $filter, $uibModal, CommonServices, $stateParams, $state) {

  var $ctrl = this;

  $scope.jobParams = $scope.$parent.jobObject;

  $scope.jobTabList = $scope.$parent.WOJobs;
  console.log($scope.jobTabList);

  loadCommon();
  $scope.lstDepartment = [];
  $scope.lstPayers = [];
  $scope.lstChargeCats = [];
  $scope.lstJobCats = [];
  $scope.lstJobTypes = [];


  function clearObject() {
    var jobObjectFirst = {
      AdditionalData: null,
      ChargeCategoryId: 0,
      Complaint: null,
      DeptId: "",
      EstimatedTime: 0,
      Items: [],
      JobAttachments: null,
      JobCategory: "",
      JobNo: "",
      JobType: "",
      MainGroupId: " ",
      Note: "",
      Payer: "",
      RowId: "",
      SmanId: "",
      SubGroupId: "",
    }
    return jobObjectFirst;
  }

  function createItem() {
    var item = {
      BUYPR: 0,
      ChargeCategoryId: 0,
      FactTime: 0,
      IGROUPID: 0,
      ItemNo: "",
      ItemType: 0,
      MechanicId: "",
      ModelCode: "",
      Name: "",
      Quantity: 0,
      RecmTime: 0,
      RowId: 0,
      SaleTime: 0,
      StockId: "",
      StockQty: 0,
      SuplNo: "",
      UNITPR: 0,
      VATCD: null,
      WorkGroupId: null,
      WorkType: ""
    }
    return item;
  }




  function loadCommon() {

    CommonServices.getChargeCats().then(function (data) {
      $scope.lstChargeCats = data;
    });
    CommonServices.getPayers().then(function (data) {
      $scope.lstPayers = data;
    })
    CommonServices.getDepartments().then(function (data) {
      $scope.lstDepartment = data;
    });
    CommonServices.getJobCats().then(function (data) {
      $scope.lstJobCats = data;

    });

    CommonServices.getJobTypes().then(function (data) {
      $scope.lstJobTypes = data;
    });

  }

  console.log($scope.jobParams);

  $scope.getClass = function (param, mechanicId) {
    switch (param) {
      case 1:
        return "icon-spare-part";
      case 2:
        return "icon-non-stock-item";
      case 3:
        return null;
      case 4:
        return "icon-sub-contractors";
      case 7:
        return "icon-labour-operation";
      case 8:
        return "icon-text-rows";
      default:
        break;
    }
  }

  $scope.getCheckRow = function (mechanicId) {
    if (mechanicId != null) {
      return "icon-checked-rows";
    } else {
      return "icon-unchecked-rows";
    }
  }



  // paging
  // $scope.totalElements = $scope.$parent.WOJobs.length;

  $scope.limit = 5;
  $scope.page = 1;

  $scope.removeItem = function (parentId, childrenId) {
    $scope.jobTabList[parentId].Items.splice(childrenId, 1);
    console.log($scope.jobTabList[parentId].Items);
  }

  // pagingData($scope.page);

  // function pagingData(currentPage) {
  // var begin = (currentPage - 1) * $scope.limit;
  // var end = begin + $scope.limit
  // $scope.jobTabList = data.slice(begin, end);
  // console.log($scope.jobTabList);
  // }


  // $scope.go = function () {
  // $scope.page = $scope.pageGo;
  // pagingData($scope.page);
  // }

  // $scope.changeLimit = function () {
  // pagingData($scope.page);
  // }

  //<editor-fold desc="Paging & Search Port">
  $scope.$watch("page", function (newValue, oldValue) {
    if (newValue != oldValue) {
      $scope.page = newValue;
      pagingData($scope.page)
    }
  });

  // end

  // toggle for single row
  this.isShow = false;
  $scope.toggleJobRow = function (param) {
    console.log(param)
    this.isShow = !this.isShow;
  }


  // modal
  $ctrl.animationsEnabled = true;

  $scope.openServiceItem = function (item, id) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/common/serviceItem-form.html',
      controller: 'ServiceItemModalCtrl',
      backdrop: 'static',
      controllerAs: '$ctrl',
      size: "full",
      resolve: {
        item: function () {
          return {
            custNo: $scope.jobParams.CustNo,
            vehiId: $scope.jobParams.VehiId,
            itemType: item
          };
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {

      if (typeof (selectedItem) === "string") {
        if ($scope.jobTabList[id].Items == null) {
          var charactersObject = createItem();
          charactersObject.Name = selectedItem;
          charactersObject.ItemType = item;
          $scope.jobTabList[id].Items = [];
          $scope.jobTabList[id].Items.push(charactersObject);
        }
        else {
          var newArray = $scope.jobTabList[id].Items.filter(function (v, i) {
            return (v.ItemType !== 8);
          })
          $scope.jobTabList[id].Items = newArray;
          var charactersObject = createItem();
          charactersObject.Name = selectedItem;
          charactersObject.ItemType = item;

          $scope.jobTabList[id].Items.push(charactersObject);

        }

      } else {
        if ($scope.jobTabList[id].Items == null) {
          $scope.jobTabList[id].Items = [];
          angular.forEach(selectedItem, function (v) {
            $scope.jobTabList[id].Items.push(v);
          })
        }
        else {
          angular.forEach(selectedItem, function (v) {
            $scope.jobTabList[id].Items.push(v);
          })
        }

      }
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };


  $scope.addJob = function () {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/workdetail/modal/job-new.html',
      controller: 'JobNewModalCtrl',
      backdrop: 'static',
      controllerAs: '$ctrl',
      size: "full",
      resolve: {
        item: function () {
          return $scope.jobParams;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      console.log(selectedItem);
      //add in new WO
      if ($scope.jobTabList === undefined) {
        var jobObj = clearObject();
        $scope.jobTabList = [];
        $scope.jobTabList.push(jobObj);
        $scope.jobTabList[0].AdditionalData = selectedItem.AdditionalData;
        $scope.jobTabList[0].EstimatedTime = selectedItem.EstimatedTime;
        $scope.jobTabList[0].JobType = selectedItem.JobType;
        $scope.jobTabList[0].Note = selectedItem.JobTitle;
        $scope.jobTabList[0].Name = selectedItem.Name;

      } else {

        var jobObj = clearObject();
        // add in detail WO
        jobObj.Note = selectedItem.JobTitle;
        jobObj.JobType = selectedItem.JobType;
        jobObj.Name = selectedItem.Name;
        jobObj.EstimatedTime = selectedItem.EstimatedTime;
        jobObj.AdditionalData = selectedItem.AdditionalData;

        console.log(jobObj);
        $scope.jobTabList.push(jobObj);
        console.log($scope.jobTabList);
      }
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };


  $scope.onSubmitForm = function () {
    var Dto = {
      postAction: "saveRows",
      data: JSON.stringify($scope.jobTabList)
    }
    WorkOrderService.postWorkOrder(Dto), then(function (res) {
      console.log(res);
    }, function (err) {
      console.log(err);
    })
  }

});


UserWebApp.controller('JobNewModalCtrl', function ($scope, $rootScope, WorkOrderService, HttpService, $translate, $location, $filter,
  $uibModal, CommonServices, $stateParams, $state, item, $uibModalInstance) {


  var $ctrl = this;
  $scope.recentSalesList = [];
  $scope.additionalData = [];
  $scope.historicalData = [];
  console.log(item);

  $scope.totalElements = 0;

  $scope.limit = 10;
  $scope.page = 1;

  //<editor-fold desc="Paging & Search Port">
  $scope.$watch("page", function (newValue, oldValue) {
    if (newValue != oldValue) {
      $scope.page = newValue;
      // loadDataSales();
    }
  });

  $scope.jobChecked = "";
  $scope.disabledButton = true;
  $scope.newJobObject = {};
  console.log($scope.newJobObject);

  $scope.go = function () {
    $scope.page = $scope.pageGo;
  }

  $scope.changeLimit = function () {
    loadDataSales(false);
  }


  // call searchserviceitem
  $scope.recentSales = function (sub) {
    console.log(sub);
    $scope.additionalData = sub.AdditionalData;
    loadDataSales(sub.JobType);
    $scope.jobChecked = sub.Name;
    $scope.newJobObject = sub;
    $scope.disabledButton = false;
  }


  function loadDataSales(jobType) {
    common.spinner(true);

    var params = {
      itemType: 502,
      skey: jobType,
      vehiId: item.VehiId,
      custNo: "",
      page: $scope.page,
      pageCount: $scope.limit
    }

    WorkOrderService.serviceItem(params).then(function (res) {
      $scope.recentSalesList = res.data;
      console.log(res);
      $scope.pageGo = $scope.page;
      $scope.isShow = false;
      common.spinner(false);
    }, function (err) {
      common.spinner(false);
      console.log(err);
    });

    WorkOrderService.countServiceItem(params).then(function (res) {
      // console.log(res)
      $scope.totalElements = res.data;
      $scope.isNoData = ($scope.totalElements <= 0);
      common.spinner(false);
      console.log(res);
    }, function (err) {
      console.log(err);
      common.spinner(false);
    });
  }

  $scope.addItem = function (value) {
    $scope.historicalData.push(value);
  }

  $scope.save = function () {
    $uibModalInstance.close($scope.newJobObject);
    $scope.newJobObject = {};
  }


  $scope.jobTreeList = [];

  loadData(item);


  function loadData(params) {
    common.spinner(true);
    WorkOrderService.jobTab(params).then(function (res) {
      $scope.jobTreeList = res.data;
      console.log(res);
      common.spinner(false);
    }, function (error) {
      console.log(error);
      common.spinner(false);
    })
  }

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})