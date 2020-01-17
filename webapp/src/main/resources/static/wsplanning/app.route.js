UserWebApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider, ivhTreeviewOptionsProvider, tmhDynamicLocaleProvider, inputModifiedConfigProvider) {

    tmhDynamicLocaleProvider.localeLocationPattern('/assets/js/core/libraries/angularjs/angular-locale/i18n/angular-locale_{{locale}}.js')
    // $urlRouterProvider.otherwise('/');

    //input Modified
    inputModifiedConfigProvider
        .enableGlobally()
    // // .setModifiedClassName('my-changed')
    // // .setNotModifiedClassName('my-clear')
    ;

    $urlRouterProvider.otherwise(function ($rootScope, $injector, $location) {
        var lang = $("#currentLang").attr('data-currentLang');
        return "/" + lang + "/todaywork";
    });

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('app', {
            abstract: true,
            url: '/{locale}'
        })

        .state('app.main', {
            url: '/',
            // templateUrl: '/pages/index.html'
            templateUrl: '/wsplanning/templates/index.html'
        })

        // nested list with custom controller
        .state('app.main.workorder', {
            url: 'workorder',
            controller: "WorkOrderCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/workOrder/index.html'
        })

        .state('app.main.todaywork', {
            url: 'todaywork',
            controller: "AllWorkOrdersCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/allWorkOrder/index.html',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(["scancode"]);
                }],
                typeWO: function ($stateParams) {
                    return "todayWO";
                }
            }
        })


        .state('app.main.unscheduledwork', {
            url: 'unscheduledwork',
            controller: "AllWorkOrdersCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/allWorkOrder/index.html',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(["scancode"]);
                }],
                typeWO: function ($stateParams) {
                    return "unScheduledWO";
                }
            }
        })

        .state('app.main.allwork', {
            url: 'allwork',
            controller: "AllWorkOrdersCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/allWorkOrder/index.html',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(["scancode"]);
                }],
                typeWO: function ($stateParams) {
                    return "allWO";
                }
            }
        })

        .state('app.main.workmot', {
            url: 'workmot',
            controller: "AllWorkOrdersCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/allWorkOrder/index.html',
            resolve: {
                typeWO: function ($stateParams) {
                    return "withMOT";
                }
            }
        })

        .state('app.main.worksub', {
            url: 'worksub',
            controller: "AllWorkOrdersCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/allWorkOrder/index.html',
            resolve: {
                typeWO: function ($stateParams) {
                    return "withSubcontractor";
                }
            }
        })
        .state('app.main.worktire', {
            url: 'worktire',
            controller: "AllWorkOrdersCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/allWorkOrder/index.html',
            resolve: {
                typeWO: function ($stateParams) {
                    return "withTire";
                }
            }
        })
        .state('app.main.workbo', {
            url: 'workbo',
            controller: "AllWorkOrdersCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/allWorkOrder/index.html',
            resolve: {
                typeWO: function ($stateParams) {
                    return "withBO";
                }
            }
        })

        .state('app.main.postponedwork', {
            url: 'postponedwork',
            controller: "AllWorkOrdersCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/allWorkOrder/index.html',
            resolve: {
                typeWO: function ($stateParams) {
                    return "postponedWO";
                }
            }
        })


        .state('app.main.stamping', {
            url: 'stamping',
            controller: "StampingCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/stamping/index.html',
            resolve: {
                typeWO: function ($stateParams) {
                    return "stamping";
                }
            }
        })

        .state('app.main.notification', {
            url: 'notification',
            controller: "NotificationCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/notification/index.html',
            resolve: {
                typeWO: function ($stateParams) {
                    return "notification";
                }
            }
        })


        .state('app.main.calendarview', {
            url: 'calendarview',
            controller: "CalendarViewCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/calendarView/index.html',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load(
                        [
                            '/wsplanning/js/callcenter/CallCenterCtrl.js',
                            '/wsplanning/js/callcenter/ActiveCallCtrl.js',
                            '/wsplanning/js/callcenter/RecentCallCtrl.js',
                            '/wsplanning/js/callcenter/CreateTaskCtrl.js',
                        ]);
                }]
            }
        })

        .state('app.main.offer', {
            url: 'offer',
            controller: "AllWorkOrdersCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/allWorkOrder/index.html',
            resolve: {
                typeWO: function ($stateParams) {
                    return "offers";
                }
            }
        })


        .state('app.main.replacementvehicle', {
            url: 'replacementvehicle',
            controller: "ReplacementVehicleCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/replacementVehicle/index.html',
        })

        .state('app.main.newwo', {
            url: 'workdetail/newwo/:type/:action/:tab',
            params: {
                tab: "header",
            },
            controller: "WorkDetailCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/workdetail/index.html',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(["workorderDetail", "modaltasklist"]);
                }],
                WorkOrder: function (WorkOrderService, $stateParams) {
                    return {data: {}};
                },
                lstMonth: function (WorkOrderService, $stateParams) {
                    var EmployeeData = $("#EmployeeData").data("employee");
                    var startDate = new Date();
                    var endDate = moment(startDate).add(1, 'M');
                    var params = {
                        "DayFrom": formatDateToApi(moment(startDate).startOf('month').toDate()),
                        "DayTo": formatDateToApi(moment(endDate).startOf('month').toDate()),
                        "DeptId": EmployeeData.DeptId,
                        "ShiftId": EmployeeData.ShiftId,
                    };
                    return WorkOrderService.calendarMonth(params);
                }
            }
        })

        .state('app.main.workdetail', {
            url: 'workdetail/:type/:id/:tab',
            params: {
                tab: null,
            },
            controller: "WorkDetailCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/workdetail/index.html',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(["workorderDetail", "modaltasklist"]);
                }],
                WorkOrder: function (WorkOrderService, $stateParams) {
                    common.spinnerFirstLoad(true);
                    var LoadRows = true;
                    var LoadAttachment = !$stateParams.tab || $stateParams.tab == "" || $stateParams.tab == "job" || $stateParams.tab == "checkin1";
                    var LoadAttachmentData = !$stateParams.tab || $stateParams.tab == "" || $stateParams.tab == "job" || $stateParams.tab == "checkin1";
                    return WorkOrderService.detail($stateParams.id, LoadRows, LoadAttachment, LoadAttachmentData).then(
                        function (response) {
                            common.spinnerFirstLoad(false);
                            return response;
                        }
                    );
                },
                lstMonth: function (WorkOrderService, $stateParams) {
                    var EmployeeData = $("#EmployeeData").data("employee");
                    var startDate = new Date();
                    var endDate = moment(startDate).add(1, 'M');
                    var params = {
                        "DayFrom": formatDateToApi(moment(startDate).startOf('month').toDate()),
                        "DayTo": formatDateToApi(moment(endDate).startOf('month').toDate()),
                        "DeptId": EmployeeData.DeptId,
                        "ShiftId": EmployeeData.ShiftId,
                    };
                    return WorkOrderService.calendarMonth(params);
                }
            }
        })

        .state('app.main.newoffer', {
            url: 'workdetail/offer/:type/:action/',
            controller: "WorkDetailCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/workdetail/index.html',
            resolve: {
                WorkOrder: function (WorkOrderService, $stateParams) {
                    return {data: {}};
                },
                lstMonth: function (WorkOrderService, $stateParams) {
                    var EmployeeData = $("#EmployeeData").data("employee");
                    var startDate = new Date();
                    var endDate = moment(startDate).add(1, 'M');
                    var params = {
                        "DayFrom": formatDateToApi(moment(startDate).startOf('month').toDate()),
                        "DayTo": formatDateToApi(moment(endDate).startOf('month').toDate()),
                        "DeptId": EmployeeData.DeptId,
                        "ShiftId": EmployeeData.ShiftId,
                    };
                    return WorkOrderService.calendarMonth(params);
                }
            }
        })

        .state('app.main.booking', {
            url: 'workdetail/:type/:action/',
            controller: "WorkDetailCtrl as $ctrl",
            templateUrl: '/wsplanning/templates/pages/workdetail/index.html',
            resolve: {
                WorkOrder: function (WorkOrderService, $stateParams) {
                    return {data: {}};
                },
                lstMonth: function (WorkOrderService, $stateParams) {
                    var EmployeeData = $("#EmployeeData").data("employee");
                    var startDate = new Date();
                    var endDate = moment(startDate).add(1, 'M');
                    var params = {
                        "DayFrom": formatDateToApi(moment(startDate).startOf('month').toDate()),
                        "DayTo": formatDateToApi(moment(endDate).startOf('month').toDate()),
                        "DeptId": EmployeeData.DeptId,
                        "ShiftId": EmployeeData.ShiftId,
                    };
                    return WorkOrderService.calendarMonth(params);
                }
            }
        })

        //Callcenter
        .state('app.main.callcenter', {
            url: 'callcenter',
            controller: "CallCenterCtrl",
            templateUrl: '/wsplanning/templates/pages/callcenter/index.html',
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load("callCenter");
                }]
            }
        })

        //Task List
        .state('app.main.tasklist', {
            url: 'tasklist',
            controller: "TaskListCtrl",
            templateUrl: '/wsplanning/templates/pages/tasklist/index.html',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load("tasklist");
                }]
            }
        })

        //Grid List
        .state('app.main.gridWO', {
            url: 'gridWO',
            controller: "GridWorkOrderCtrl",
            templateUrl: '/wsplanning/templates/pages/gridWorkOrder/index.html',
            resolve: {
                listDataFilter: function ($q, CommonFactory) {
                    var deferred = $q.defer();
                    $q.all([
                        CommonFactory.doQuery('getWorkOrderStatuses'),
                        CommonFactory.doQuery('getSubStatuses')
                    ]).then(function (data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load(["scancode", "gridWorkOrder"]);
                }],
                listField: function ($http, $q, $translate) {
                    var listField = [
                        {Id: "WorkOrderStatus", Name: $translate.instant('WorkOrderStatus'), order: false, length:16, format:'string', type:'string'},
                        {Id: "SubStatus", Name: $translate.instant('SubStatus'), order: false,  length:16,format:'string', type:'string'},
                        {Id: "VisitReasonCode", Name: $translate.instant('VisitReasonCode'), order: false,  length:16, format:'string', type:'string'},
                        {Id: "DeptId", Name: $translate.instant('DeptId'), order: false,  length:16, format:'string', type:'string'},
                        {Id: "TransactionType", Name: $translate.instant('TransactionType'), order: false,  length:2, format:'string', type:'string'},
                        {Id: "WorkOrderNo", Name: $translate.instant('WorkOrderNo'), order: false, length:10, format:'number', type:'number'},
                        {Id: "PayerInfo", Name: $translate.instant('PayerInfo'), order: false, length:30, format:'string', type:'string'},
                        {Id: "EstimatedTimeTot", Name: $translate.instant('EstimatedTimeTot'), order: false,  length:16, format:'dd.mm.yyyy', type:'date'},
                        {Id: "PoolTimeTot", Name: $translate.instant('PoolTimeTot'), order: false,  length:16, format:'dd.mm.yyyy', type:'date'},
                        {Id: "BookedTimeTot", Name: $translate.instant('BookedTimeTot'), order: false, length:16, format:'dd.mm.yyyy', type:'date'},
                        {Id: "ServiceAdvisorId", Name: $translate.instant('ServiceAdvisorId'), order: false, length:16, format:'string', type:'string'},
                        {Id: "ServiceDate", Name: $translate.instant('ServiceDate'), order: false, length:16, format:'dd.mm.yyyy', type:'date'},
                        {Id: "SubContractorInfo", Name: $translate.instant('SubContractorInfo'), order: false, length:30, format:'string', type:'string'},
                        {Id: "Mileage", Name: $translate.instant('Mileage'), order: false, length:10, format:'number', type:'number'},
                        {Id: "Reference", Name: $translate.instant('Reference'), order: false, length:16,format:'string', type:'string'},
                        {Id: "WorkOrderNote", Name: $translate.instant('WorkOrderNote'), order: false, length:16,format:'string', type:'string'},
                        {Id: "CheckOutDate", Name: $translate.instant('CheckOutDate'), order: false, length:16,format:'dd.MM.yyyy hh:mm', type:'date'},
                        {Id: "DeliveredBy", Name: $translate.instant('DeliveredBy'), order: false, length:10,format:'string', type:'string'},
                        // {Id: "WorkReadyDate", Name: $translate.instant('WorkReadyDate'), order: false, length:16,format:'dd.mm.yyyy', type:'date'},
                        {Id: "WorkReadyBy", Name: $translate.instant('WorkReadyBy'), order: false, length:16,format:'string', type:'string'},
                        {Id: "AttachmentFilesCount", Name: $translate.instant('AttachmentFilesCount'), order: false, length:16,format:'string', type:'string'},
                        {Id: "LicenseNo", Name: $translate.instant('LicenseNo'), order: false, length:20,format:'string', type:'string'},
                        {Id: "SearchKey", Name: $translate.instant('SearchKey'), order: false, length:20,format:'string', type:'string'},
                        {Id: "VIN", Name: $translate.instant('VIN'), order: false,  length:17,format:'string', type:'string'},
                        {Id: "FirstRegDate", Name: $translate.instant('FirstRegDate'), order: false, length:16,format:'dd.mm.yyyy', type:'date'},
                        {Id: "NextServiceDate", Name: $translate.instant('NextServiceDate'), order: false, length:16,format:'dd.mm.yyyy', type:'date'},
                        {Id: "NextMOTDate", Name: $translate.instant('NextMOTDate_Grid'), order: false, length:16,format:'dd.mm.yyyy', type:'date'},
                        {Id: "PreviousServiceDate", Name: $translate.instant('PreviousServiceDate'), order: false, length:16,format:'dd.mm.yyyy', type:'date'},
                        {Id: "Make", Name: $translate.instant('Make'), order: false, length:20,format:'string', type:'string'},
                        {Id: "Model", Name: $translate.instant('Model'), order: false, length:20,format:'string', type:'string'},
                        {Id: "SubModel", Name: $translate.instant('SubModel'), order: false, length:20,format:'string', type:'string'},
                        {Id: "CustNo", Name: $translate.instant('CustNo'), order: false, length:10,format:'string', type:'string'},
                        // {Id: "FName", Name: $translate.instant('FName'), order: false, length:20,format:'string', type:'string'},
                        // {Id: "LName", Name: $translate.instant('LName'), order: false, length:20,format:'string', type:'string'},
                        {Id: "ContactFName", Name: $translate.instant('ContactFName'), order: false, length:20,format:'string', type:'string'},
                        {Id: "ContactLName", Name: $translate.instant('ContactLName'), order: false, length:20,format:'string', type:'string'},
                        {Id: "CourtesyCarInfo", Name: $translate.instant('CourtesyCarInfo'), order: false, length:20,format:'string', type:'string'},
                        {Id: "VehicleNote", Name: $translate.instant('VehicleNote'), order: false, length:40,format:'string', type:'string'},
                        {Id: "WorkReadyForInvoiceDate", Name: $translate.instant('WorkReadyForInvoiceDate'), order: false, length:20,format:'dd.MM.yyyy hh:mm', type:'date'},


                    ];
                    var deferred = $q.defer();
                    $http.get('/site/getWOSort', {}).then(function successCallback(response) {
                        var lstSort = response.data;
                        var field, sort;
                        for (var i = 0; i < listField.length; i++) {
                            field = listField[i];
                            for (var j = 0; j < lstSort.length; j++) {
                                sort = lstSort[j];
                                if (field.Id == sort.Id
                                    || field.Id.toUpperCase() == sort.Id.toUpperCase()) {
                                    field.order = true;
                                    break;
                                }
                            }
                        }

                        deferred.resolve(listField);
                    }, function errorCallback(response) {
                        console.error(response);
                        deferred.reject([]);
                    });
                    return deferred.promise;
                }
            }
        })

    //$locationProvider.html5Mode(true);
});



