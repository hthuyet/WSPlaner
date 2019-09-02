UserWebApp.controller('JobDetailCtrl', function ($scope, $translate, $rootScope, $window, $timeout, WorkOrderService, $uibModal, CommonServices, $stateParams, $state) {

  var $ctrl = this;
  var stampingCode = {};
  $scope.jobParams = $scope.$parent.jobObject;
  $scope.actTypeJob = $scope.$parent.actionType;
  $scope.jobTabList = $scope.$parent.WOJobs;
  console.log($scope.jobTabList)
  $scope.stateParams = $stateParams;
  $scope.lstTextPredict = [];
  $scope.externalUrl = [];
  $scope.count_Vehi_Notification = $scope.jobParams.VehicleNotifications.length;
  console.log($scope.jobParams)

  var lstIndex = [];
  var suppliers = [];
  var jobsList = [];
  $scope.lstButtonDetail = JSON.parse(localStorage.getItem('info_detail'));

  console.log($scope.lstButtonDetail);

  angular.forEach($scope.lstButtonDetail, function (item) {
    item.translate = $translate.instant(item.name);
  });

  $scope.isShow = false;

  $scope.toggleAllJobs = function () {
    if ($scope.isShow == true) {
      $scope.isShow = false;
      angular.forEach($scope.jobTabList, function (v, k) {
        console.log(k);
        v.collapse = false;
        console.log(v.collapse)
        // $scope.toggleJobRow(v);
      });
    } else {
      $scope.isShow = !$scope.isShow;
      angular.forEach($scope.jobTabList, function (v, k) {
        $scope.toggleJobRow(v);
      });
    }
  }

  // toggle for single row
  // this.isShow = false;
  $scope.toggleJobRow = function (item) {
    // console.log(index);
    item.collapse = !item.collapse;
  }

  loadCommon();
  $scope.lstDepartment = [];
  $scope.lstPayers = [];
  $scope.lstChargeCats = [];
  $scope.lstJobCats = [];
  $scope.lstJobTypes = [];


  function clearObject() {
    var jobObjectFirst = {
      AdditionalData: null,
      ChargeCategoryId: NaN,
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
      RowId: 0,
      SmanId: "",
      SubGroupId: "",
    }
    return jobObjectFirst;
  }

  function createItem() {
    var item = {
      BUYPR: 0,
      ChargeCategoryId: NaN,
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
      WorkType: "",
      Reference: ""
    }
    return item;
  }

  function saveData(initData) {
    return initData;
  }

  $scope.$on('isCollapsed', function (evt, obj) {
    if ($scope.jobTabList) {
      $scope.jobTabList.map((item) => {
        item.collapse = false;
      })
        ;
    }
  })

  function loadCommon() {

    CommonServices.getChargeCats().then(function (data) {
      $scope.listChargeCats = data;
      console.log(data)
    });
    CommonServices.getPayers().then(function (data) {
      $scope.lstPayers = data;
      
    })
    CommonServices.getDepartments().then(function (data) {
      $scope.lstDepartment = data;
      
    });
    CommonServices.getJobCats().then(function (data) {
      $scope.lstJobCats = data;
      console.log(data)
    });

    CommonServices.getJobTypes().then(function (data) {
      $scope.lstJobTypes = data;
    });

    CommonServices.getSuppliers().then(function (res) {
      // console.log(res);
      suppliers = res;
    });


    WorkOrderService.getStamping().then(function (res) {

      stampingCode = res.data[0];
    }, function (err) {
      console.log(err);
    });

    if ($scope.jobTabList) {
      $scope.jobTabList.map((item) => {
        item.collapse = false;
      })
        ;
    }
    console.log($scope.jobTabList);

    if ($scope.WorkOrder.ExternalURL) {
      $scope.externalUrl = $scope.WorkOrder.ExternalURL;
      console.log($scope.externalUrl);
      $scope.externalUrl.unshift({ "Id": "", "Name": $translate.instant('pleaseSelect') });
    }

  }

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


  $scope.getCheckRow = function (parentId, id, checked) {
    if (checked == false) {
      $scope.jobTabList[parentId].Items[id].MechanicId = null;
      console.log("--done--");
    } else {
      $scope.jobTabList[parentId].Items[id].MechanicId = $scope.WorkOrder.Token.EmployeeData.SmanId;
      console.log($scope.jobTabList[parentId].Items[id]);
      console.log("--done--");
    }
  }

  $scope.limit = 5;
  $scope.page = 1;

  $scope.removeItem = function (parentId, childrenId) {
    var rowId = $scope.jobTabList[parentId].Items[childrenId].RowId;
    var itemNo = $scope.jobTabList[parentId].Items[childrenId].ItemNo;
    if (rowId == 0 && itemNo == "") {
      $scope.jobTabList[parentId].Items.splice(childrenId, 1);
    } else if (rowId == 0 && itemNo != "") {
      $scope.jobTabList[parentId].Items.splice(childrenId, 1);

    } else {
      $scope.jobTabList[parentId].Items[childrenId].RowId = $scope.jobTabList[parentId].Items[childrenId].RowId * (-1);
    }

    console.log($scope.jobTabList[parentId].Items);
  }

  $scope.markAll = function (jobId) {
    var data = $scope.jobTabList[jobId].Items;
    angular.forEach(data, function (v, k) {
      if (v.ItemType == 7 || v.ItemType == 8) {
        v.checked = true;
        if (v.MechanicId == "" || v.MechanicId == null || v.MechanicId == undefined) {
          $scope.getCheckRow(jobId, k, true);
        }
      }
    });
    $scope.jobTabList[jobId].collapse = false;
  }

  $scope.changeValueCheckBox = function (mechanicId, checked) {
    if (mechanicId) {
      checked = true;
      return checked;
    }
  }

  $scope.changeExternalUrl = function (v) {
    if ($window.confirm('Do you really want to leave ?')) {
      if ($scope.externalUrl) {
        var data = $scope.externalUrl.find(item => item.Id == v);
        $window.open(data.URL);
      }
    }

  }

  //<editor-fold desc="Paging & Search Port">
  $scope.$watch("page", function (newValue, oldValue) {
    if (newValue != oldValue) {
      $scope.page = newValue;
      pagingData($scope.page)
    }
  });

  // end



  $scope.openTypeModal = function (name, item, id) {
    switch (name) {
      case "notifyteam": $scope.openNotifyTeam(item);
        break;
      case "notify": $scope.openNotify(item);
        break;
      case "photo": $scope.openImage(item, id);
        break;
      case "stamping": $scope.addStamping(item);
        break;
      case "labour": $scope.openServiceItem(7, id);
        break;
      case "sparepart": $scope.openServiceItem(1, id);
        break;
      case "textrow": $scope.openServiceItem(8, id);
        break;
      case "subcontractor": $scope.openServiceItem(4, id);
        break;
      case "nonstockitem": $scope.openServiceItem(2, id);
        break;
      case "package": $scope.openServiceItem(500, id);
        break;
      case "postponed": $scope.postponed(item, id);
        break;
      default:
        break;
    }
  }

  $scope.openNewTab = function (params) {
    $window.open($scope.jobParams.VHCLink);
  }

  $scope.openCampaign = function () {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/workdetail/modal/campaign-form.html',
      controller: 'CampaignModalCtrl',
      backdrop: 'static',
      controllerAs: '$ctrl',
      size: 'lg',
      resolve: {
        item: function () {
          return $scope.jobParams.VehicleNotifications;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      console.log(selectedItem)
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
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
        },
        suppliers: function () {
          return suppliers;
        }
      }
    });

    modalInstance.rendered.then(function () {
      $rootScope.$broadcast("openServiceItem_" + item, {});
    });

    modalInstance.result.then(function (selectedItem) {
      console.log($scope.jobTabList);
      console.log(id);
      var reference = "";
      $scope.$on('reference', function (event, obj) {
        reference = obj.item;
      })
      if (typeof (selectedItem) === "string") {
        if ($scope.jobTabList[id].Items == null) {
          var charactersObject = createItem();
          charactersObject.Name = selectedItem;
          charactersObject.ItemType = item;
          charactersObject.MechanicId = "";
          charactersObject.RowId = 0;
          charactersObject.Reference = reference;
          $scope.jobTabList[id].Items = [];
          $scope.jobTabList[id].Items.push(charactersObject);
        } else {
          var charactersObject = createItem();
          charactersObject.Name = selectedItem;
          charactersObject.ItemType = item;
          charactersObject.MechanicId = "";
          charactersObject.RowId = 0;
          charactersObject.Reference = reference;
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
      // console.log(selectedItem);

      //add in new WO
      if ($scope.jobTabList === undefined) {
        var jobObj = clearObject();
        $scope.jobTabList = [];
        $scope.jobTabList.push(jobObj);
        $scope.jobTabList[0].AdditionalData = selectedItem.sub.AdditionalData;
        $scope.jobTabList[0].EstimatedTime = selectedItem.sub.EstimatedTime;
        $scope.jobTabList[0].JobType = selectedItem.sub.JobType;
        $scope.jobTabList[0].Note = selectedItem.sub.JobTitle;
        $scope.jobTabList[0].Name = selectedItem.sub.Name;
        $scope.jobTabList[0].Items = selectedItem.Items;
        $scope.jobTabList[0].MainGroupId = selectedItem.id;
        $scope.jobTabList[0].SubGroupId = selectedItem.sub.Id;
        $scope.jobTabList[0].Complaint = selectedItem.sub.JobComplaint
        $scope.jobTabList[0].DeptId = $scope.WorkOrder.DeptId;
      } else {

        var jobObj = clearObject();
        // add in detail WO
        jobObj.Note = selectedItem.sub.JobTitle;
        jobObj.JobType = selectedItem.sub.JobType;
        jobObj.Name = selectedItem.sub.Name;
        jobObj.EstimatedTime = selectedItem.sub.EstimatedTime;
        jobObj.AdditionalData = selectedItem.sub.AdditionalData;
        jobObj.Items = selectedItem.Items;
        jobObj.MainGroupId = selectedItem.id;
        jobObj.SubGroupId = selectedItem.sub.Id;
        jobObj.Complaint = selectedItem.sub.JobComplaint;
        // console.log(jobObj);
        $scope.jobTabList.push(jobObj);
        // console.log($scope.jobTabList);
      }
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };


  $scope.addStamping = function (item) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/common/confirm-form.html',
      controller: 'StampingModalCtrl',
      backdrop: 'static',
      controllerAs: '$ctrl',
      size: "sm",
      resolve: {
        item: {
          WorkOrderId: $scope.WorkOrder.WorkOrderId,
          WorkOrderNo: $scope.WorkOrder.WorkOrderNo,
          RowId: item.RowId,
          StampingCode: stampingCode.Id,
          JobNo: item.JobNo
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      console.log(selectedItem);
      if (selectedItem.status === 200) {
        common.notifySuccess("Success!!!");

        //Load Stamp
        // $rootScope.$on('routestateChangeSuccess', function (event, data) {
        $("body").addClass("sidebar-xs");
        CommonServices.getStamping().then(function (data) {
          if (data && data.StampText) {
            $rootScope.stamping = data.StampText;
          } else {
            $rootScope.stamping = "";
          }
        });
        // });

        //reload state
        $state.reload();

      } else {
        common.notifyError("Error!!!");
      }

    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };


  $scope.openImage = function (item, id) {
    console.log("--openImage:" + id);
    console.log(item);
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/common/photo-form.html',
      controller: 'PhotoModalCtrl',
      backdrop: 'static',
      controllerAs: '$ctrl',
      size: "full",
      resolve: {
        data: {
          item: item,
          workOrderId: $scope.WorkOrder.WorkOrderId,
          jobAttachments: $scope.jobTabList[id].JobAttachments
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      // console.log(selectedItem);
      $scope.jobTabList[id].JobAttachments = selectedItem
      // console.log( $scope.jobTabList[id]);
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };


  $scope.openNotify = function (item) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/common/notification-form.html',
      controller: 'NotificationModalCtrl',
      backdrop: 'static',
      controllerAs: '$ctrl',
      size: "lg",
      resolve: {
        data: {
          item: item,
          WorkOrderId: $scope.WorkOrder.WorkOrderId,
        }
      }
    });

    modalInstance.rendered.then(function () {
      $rootScope.$broadcast("openNotify", {});
    });

    modalInstance.result.then(function (selectedItem) {

      console.log(selectedItem);
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };


  $scope.openNotifyTeam = function (item) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: '/wsplanning/templates/pages/common/notification-team-form.html',
      controller: 'NotificationTeamCtrl',
      backdrop: 'static',
      controllerAs: '$ctrl',
      size: "lg",
      resolve: {
        data: {
          item: item,
          WorkOrderId: $scope.WorkOrder.WorkOrderId,
        }
      }
    });

    modalInstance.rendered.then(function () {
      $rootScope.$broadcast("openNotifyTeam", {});
    });

    modalInstance.result.then(function (selectedItem) {

      console.log(selectedItem);
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };


  var headerData = {};
  // get headerData
  $rootScope.$on("headerData", function (evt, obj) {
    headerData = obj;
    console.log(obj);
  });

  $scope.pristine = false;


  function emitData(params) {
    $scope.$emit("jobData", {
      data: $scope.WorkOrder,
      modified: params,
    }
    );
  }

  $scope.$watch('jobTabList', function (newValue, oldValue) {

    if ($scope.actTypeJob === "new") {
      $scope.pristine = true;
      $scope.jobTabList = newValue;
      $scope.WorkOrder.WOJobs = $scope.jobTabList;
      emitData($scope.pristine);

      //if the form is modified => using $emit to send data
      $scope.$on('inputModified.formChanged', function (event, modified, formCtrl) {
        console.log(formCtrl.$name);
        emitData(modified);
      });
    } else {
      if (newValue && oldValue && newValue.length > oldValue.length) {
        $scope.pristine = true;
        $scope.jobTabList = newValue;
        $scope.WorkOrder.WOJobs = $scope.jobTabList;
        emitData($scope.pristine);

        //if the form is modified => using $emit to send data
        $scope.$on('inputModified.formChanged', function (event, modified, formCtrl) {
          console.log(formCtrl.$name);
          emitData(modified);
        });
      } else {
        $scope.pristine = false;
      }

    }
  });


  $scope.onSubmitForm = function (params) {
    if ($scope.actTypeJob === "new") {

      var postAction = "createNew";

      //save job - after save header
      $scope.WorkOrder.WOJobs = $scope.jobTabList;

      var data = JSON.stringify($scope.WorkOrder)

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

      }, function (err) {
        common.btnLoading($(".btnSubmit"), false);
        console.log(err);
        common.notifyError("Error!!!", err.status);
      })

    } else {
      var postAction = "saveRows";

      if (headerData.modified == true) {
        common.btnLoading($(".btnSubmit"), true);
        WorkOrderService.postWorkOrder(headerData.data, "saveHeader").then(function (res) {
          common.btnLoading($(".btnSubmit"), false);
        }, function (err) {
          common.btnLoading($(".btnSubmit"), false);
          common.notifyError("Error!!!", err.status);
        })
      }

      // save job - after save header
      $scope.WorkOrder.WOJobs = $scope.jobTabList;
      var data = JSON.stringify($scope.WorkOrder)
      common.btnLoading($(".btnSubmit"), true);
      console.log($scope.WorkOrder);
      // return;
      WorkOrderService.postWorkOrder(data, postAction).then(function (res) {
        common.btnLoading($(".btnSubmit"), false);
        if (res.data.Token && res.data.Token.ErrorDesc) {
          common.notifyWithMessage("Warning!!!", res.status, res.data.Token.ErrorDesc)
        } else {
          common.notifySuccess("Success!!!");
        }
        if (params) {
          console.log(params);
          $state.transitionTo($state.current, params, {
            reload: false, inherit: false, notify: false, location: "replace"
          });
        } else {
          $state.reload();
        }

      }, function (err) {
        common.btnLoading($(".btnSubmit"), false);
        console.log(err);
        common.notifyError("Error!!!", err.status);
      });
    }
  }

  //Save from button header
  $scope.$on('saveJob', function (event, obj) {
    $scope.onSubmitForm(obj.item);
  });

  $scope.afterRender = function () {
    console.log("------afterRender--------");
    $rootScope.WorkOrderOrg = angular.copy($scope.WorkOrder);
    generateBarcode();
  }

  $scope.postponed = function (item, id) {

    console.log("-------post----");
    if (item.PostPoned == false) {
      var postAction = "postPoneJob";
      $scope.jobTabList[id].PostPoned = true;
      $scope.WorkOrder.WOJobs = $scope.jobTabList;
      var data = JSON.stringify($scope.WorkOrder)
      common.btnLoading($(".btnSubmit"), true);
      console.log($scope.WorkOrder);

      WorkOrderService.postWorkOrder(data, postAction).then(function (res) {
        common.btnLoading($(".btnSubmit"), false);
        console.log(res);
        if (res.data.Token && res.data.Token.ErrorDesc) {
          common.notifyWithMessage("Warning!!!", res.status, res.data.Token.ErrorDesc)
        } else {
          common.notifySuccess("Success!!!");
        }
        // $state.reload();

      }, function (err) {
        common.btnLoading($(".btnSubmit"), false);
        console.log(err);
        common.notifyError("Error!!!", err.status);
      });
    } else {
      common.notifyWithMessage("This job was updated!!!")
    }

  }

  //Barcode generate
  function generateBarcode() {
    if($scope.jobTabList && $scope.jobTabList.length > 0) {
      var item = {};
      for (var i = 0; i < $scope.jobTabList.length; i++) {
        item = $scope.jobTabList[i];
        JsBarcode("#barcode_" + item.RowId, item.JobBarCode, {
          format: "CODE39",
          width: 1,
          height: 70,
          displayValue: true
        });

      }
    }
  }

  $timeout(function () {
    generateBarcode();
  },0);


});


UserWebApp.controller('JobNewModalCtrl', function ($scope, $rootScope, WorkOrderService, item, $uibModalInstance) {


  var $ctrl = this;
  $scope.recentSalesList = [];
  $scope.additionalData = [];
  $scope.historicalData = [];
  // console.log(item);


  $ctrl.isOpenDateInput = false;
  $scope.openDateInput = function (e) {
    e.preventDefault();
    e.stopPropagation();
    $ctrl.isOpenDateInput = true;
  };


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

  $scope.jobChecked = {
    MainGroup: '',
    SubGroup: ''
  };
  $scope.disabledButton = true;
  $scope.newJobObject = {};
  // console.log($scope.newJobObject);
  // console.log($scope.jobChecked);

  $scope.go = function () {
    $scope.page = $scope.pageGo;
  }

  $scope.changeLimit = function () {
    loadDataSales(false);
  }


  // call searchserviceitem
  $scope.recentSales = function (sub, mainGroup, id) {
    console.log(sub);
    $scope.additionalData = sub.AdditionalData;
    loadDataSales(sub.JobType);
    $scope.jobChecked.SubGroup = sub.Name;
    $scope.jobChecked.MainGroup = mainGroup;
    $scope.newJobObject = {
      sub: sub,
      id: id,
      name: mainGroup
    };
    $scope.disabledButton = false;
  }


  function loadDataSales(jobType) {
    common.spinner(true);

    var params = {
      itemType: 502,
      skey: jobType,
      vehiId: item.VehiId,
      custNo: item.CustNo,
      page: $scope.page,
      pageCount: $scope.limit
    }

    WorkOrderService.serviceItem(params).then(function (res) {
      $scope.recentSalesList = res.data;
      $scope.pageGo = $scope.page;
      $scope.isShow = false;
      common.spinner(false);
    }, function (err) {
      common.spinner(false);
      console.log(err);
    });

    WorkOrderService.countServiceItem(params).then(function (res) {
      $scope.totalElements = res.data;
      $scope.isNoData = ($scope.totalElements <= 0);
      common.spinner(false);
      // console.log(res);
    }, function (err) {
      console.log(err);
      common.spinner(false);
    });
  }

  $scope.addItem = function (value) {
    $scope.historicalData.push(value);
  }

  $scope.save = function () {
    $scope.newJobObject.Items = [];
    $scope.newJobObject.Items = $scope.historicalData
    $uibModalInstance.close($scope.newJobObject);
    $scope.newJobObject = {};
  }


  $scope.jobTreeList = [];


  $scope.collapseMenu = function (item) {
    item.selected = !item.selected;
    // console.log($scope.jobTreeList);
  }


  loadDataTree(item);

  function loadDataTree(params) {
    common.spinner(true);
    WorkOrderService.jobTab(params).then(function (res) {
      var data = res.data;
      console.log(res.data);
      angular.forEach(data, function (value) {
        var objTree = {};
        objTree.id = value.Id;
        objTree.label = value.Name;
        objTree.selected = false;
        objTree.children = [];
        objTree.SubGroups = value.SubGroups;
        $scope.jobTreeList.push(objTree);
      }
      );

      // console.log($scope.jobTreeList);
      common.spinner(false);
      // console.log(res);
    }, function (err) {
      console.log(err);
      common.notifyError("System error!");
      common.spinner(false);
    })
  }

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})




UserWebApp.controller('TakeScreenshotCtrl', function ($scope, $uibModalInstance) {

  var $ctrl = this;

  $scope.photo = {}
  $scope.lstphoto = []

  $scope.takeScreenshot = function () {
    var strImg = angular.element(document.querySelector('img'));
    var dataUrl = strImg.context.currentSrc.split(',');
    // var byteString = atob(dataUrl[1]);
    // var arrayBuffer = new ArrayBuffer(byteString.length);
    // var uint8Array = new Uint8Array(arrayBuffer);
    // for (var i = 0; i < byteString.length; i++) {
    //   uint8Array[i] = byteString.charCodeAt(i);
    // }

    // var blob = new Blob([uint8Array], { type: 'image/jpeg' });
    // var file = new File([blob], "image.jpg");
    // $scope.lstphoto.push(file);
    $scope.lstphoto.push(strImg.context.currentSrc);
    console.log($scope.lstphoto);

  }


  $ctrl.save = function () {
    $uibModalInstance.close($scope.lstphoto);
  }

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})

UserWebApp.controller('openPhotoCtrl', function ($scope, item, $uibModalInstance, $timeout) {

  $scope.colorPhoto = "rgb(255, 0, 0)";
  $scope.$watch("colorPhoto", function (newValue, oldValue) {
    if (newValue != oldValue) {
      console.log(newValue);
      $timeout(function () {
        angular.element('#btnUpdateColorPhoto').triggerHandler('click');
      });
    }
  });

  var $ctrl = this;
  console.log(item);

  $scope.photo = item;

  $scope.dataUrlOriginal = item;

  $scope.$on("acceptPhoto", function (evt, obj) {
    $uibModalInstance.close(obj);
  });

  $ctrl.onSubmit = function () {
    var photoCanvas = $scope.accept();
    console.log(photoCanvas);
    if (!photoCanvas.isEmpty) {
      $uibModalInstance.close(photoCanvas.dataurl);
    } else {
      $uibModalInstance.close($scope.lstphoto);
    }
  }

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})


UserWebApp.controller('NotificationModalCtrl', function ($scope, data,
  $uibModalInstance, CommonServices, $rootScope, HttpService) {


  var $ctrl = this;

  $scope.employees = [];

  function loadCombo() {
    CommonServices.getEmployees().then(function (data) {
      var uniqueArray = data.map(o => o['SmanId']).
        map((o, i, final) => final.indexOf(o) === i && i).filter(o => data[o]).map(o => data[o]);
      // $scope.employees = [];
      $scope.employees = uniqueArray;
      // console.log(data);
      // console.log(uniqueArray);
    });
  }

  loadCombo();

  $scope.target = {}


  function object() {
    var notiObject = {
      Id: "",
      SmanId: "",
      CreatedBy: "",
      Note: "",
      SiteId: "",
      IsNotified: "",
      Created: "",
      NotifiedTime: "",
      WorkOrderId: "",
      WorkOrderRowId: ""
    }
    return notiObject;
  }


  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $ctrl.send = function (param) {
    var obj = object();

    obj.Note = param.text;
    obj.SmanId = param.employee;
    obj.WorkOrderId = data.WorkOrderId;
    obj.WorkOrderRowId = data.item.RowId;

    HttpService.postData('/site/postNotification', obj).then(function (response) {
      console.log(response);
      common.spinner(false);
    }, function error(response) {
      console.log(response);
      common.spinner(false);
    });

    $rootScope.$emit('message', { "item": "" })

    $uibModalInstance.close($scope.target);
  };


  //using for reply notification
  $ctrl.save = function () {
    $uibModalInstance.close($scope.target);
  }

  //ThuyetLV
  $rootScope.$on('openNotify', function () {
    try {
      $(".firstFocus").focus();
    } catch (e) {
      console.error(e);
    }

  });

});

UserWebApp.controller('NotificationTeamCtrl', function ($scope, data, WorkOrderService,
  $uibModalInstance, CommonServices, $rootScope, $timeout, HttpService) {

  var $ctrl = this;
  // console.log(data);

  $scope.textTreeList = [];

  $scope.target = {};

  $scope.teams = [];

  function object() {
    var notiObject = {
      Id: "",
      SmanId: "",
      CreatedBy: "",
      Note: "",
      SiteId: "",
      IsNotified: "",
      Created: "",
      NotifiedTime: "",
      WorkOrderId: "",
      WorkOrderRowId: ""
    }
    return notiObject;
  }

  //tree menu for the text line
  $scope.collapseMenu = function (item) {
    item.selected = !item.selected;
    // console.log($scope.jobTreeList);
  }

  $scope.jobChecked = {
    MainGroup: '',
    SubGroup: ''
  };

  function loadCombo() {
    common.spinner(true);
    CommonServices.getTeams().then(function (data) {

      $scope.teams = data;

    });

    WorkOrderService.getTextLine().then(function (res) {
      console.log(res);
      var data = res.data;
      angular.forEach(data, function (value) {
        var objTree = {};
        objTree.id = value.Id;
        objTree.label = value.Name;
        objTree.selected = false;
        objTree.children = [];
        objTree.SubGroups = value.SubGroups;
        $scope.textTreeList.push(objTree);
      }
      );
      common.spinner(false);
    }, function (err) {
      console.log(err);
      common.spinner(false);
    })
  }

  loadCombo();

  $scope.strItem = "";

  $scope.setFocus = function () {

  }

  $scope.addTextLine = function (sub, mainGroup) {
    $scope.jobChecked.SubGroup = sub.Name;
    $scope.jobChecked.MainGroup = mainGroup;
    $scope.strItem = $scope.strItem + " " + mainGroup + "/" + sub.Name + "\n";
    angular.element('#text-message').focus();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $ctrl.send = function (param, str) {
    var obj = object();

    obj.Note = str;
    obj.SmanId = param.team;
    obj.WorkOrderId = data.WorkOrderId;
    obj.WorkOrderRowId = data.item.RowId;

    HttpService.postData('/site/postNotification', obj).then(function (response) {
      console.log(response);
      common.spinner(false);
    }, function error(response) {
      console.log(response);
      common.spinner(false);
    });

    $rootScope.$emit('message', { "item": "" })

    $uibModalInstance.close($scope.target);
  };


  //ThuyetLV
  $rootScope.$on('openNotifyTeam', function () {
    try {
      $(".firstFocus").focus();
    } catch (e) {
      console.error(e);
    }

  });

});
