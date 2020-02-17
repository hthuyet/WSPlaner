UserWebApp.controller('GridWorkOrderCtrl', function ($scope, $rootScope, $locale, HttpService, $translate, $q, $http, $timeout, $window, $location, $state, $filter, $uibModal, CommonFactory, CommonServices, listField,listDataFilter) {
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

    $scope.searchPr = {
        "WorkOrderStatus": "",
        "SubStatus": "",
        "VisitReasonCode": "",
        "OnlyToday": ""
    };

    $scope.limit = 50;
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


    // $scope.loadCommon();
    $scope.lstTrans = [];
    $scope.lstDepartment = [];
    $scope.lstServ = [];
    $scope.lstVisitReason = [];
    $scope.lstShift = [];

    $scope.lstWOStatus = listDataFilter[0];
    $scope.lstSubState = listDataFilter[1];

    $scope.loadCommon = function() {
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
            //Filter
            "WorkOrderStatus": $scope.searchPr.WorkOrderStatus,
            "SubStatus": $scope.searchPr.SubStatus,
            "VisitReasonCode": $scope.searchPr.VisitReasonCode,
            "OnlyToday": $scope.searchPr.OnlyToday,

        };

        HttpService.postData('/wo/getGridWO', params).then(function (response) {
            $scope.lstData = response;
            console.log(response)
            $scope.pageGo = $scope.page;
            $scope.isShow = false;
            common.spinner(false);
        }, function error(response) {
            common.spinner(false);
        });

        if (count) {
            HttpService.postData('/wo/countWO', params).then(function (response) {
                $scope.totalElements = response;
                console.log(response);
                $scope.isNoData = ($scope.totalElements <= 0);
                common.spinner(false);
            }, function error(response) {
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

    $scope.sort = function (field) {
        if (field == $scope.sortable.name) {
            if ($scope.sortable.direction == "desc") {
                $scope.sortable.direction = "asc";
            } else {
                $scope.sortable.direction = "desc";
            }
        } else {
            $scope.sortable = {
                name: field,
                direction: "desc",
            };
        }
        loadData(false);
    }

    $scope.onRefresh = function () {
        $scope.limit = '50';
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
        $rootScope.$broadcast("modalFrm", {"item": {}});
    }

    $scope.editItem = function (item) {
        $('#modalFrm').modal('show');
        $rootScope.$broadcast("modalFrm", {"item": angular.copy(item, {})});
    }

    //Modal
    var $ctrl = this;
    $ctrl.animationsEnabled = true;

    //function viewDetail
    $scope.viewDetail = function (item) {
        $timeout(function () {
            $state.go('app.main.workdetail', {
                'locale': $rootScope.lang,
                'id': item.WorkOrderId,
                'type': 'allWO',
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
            resolve: {}
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
            if (Quagga) {
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
                if (obj.scanner) {
                    obj.scanner.stop();
                }

                if (obj.code) {
                    $scope.params.skey = obj.code;
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



    $scope.woStatus = [
        {"Id": "WorkOrderStatus", "check": false},
        {"Id": "SubStatus", "check": false},
    ];


    $scope.filters = {
        "WorkOrderStatus": {"isActive": false, "isOpen": false, "options": $scope.lstWOStatus},
        "SubStatus": {"isActive": false, "isOpen": false,"options": $scope.lstSubState},
    };

    $scope.openFilter = function (key,value) {
        $scope.filters[key].isOpen = value;
    }

    $scope.checkChange = function (key, value) {
        if (value) {
            $scope.filters[key].isActive = true;
        } else {
            $scope.filters[key].isActive = false;
        }

        $scope.filters[key].isOpen = false;
        loadData(true);
    }

});
