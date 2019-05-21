angular.module('UserWebApp').controller('CallCenterCtrl', function ($scope, $rootScope, $state, $timeout, HttpService, $translate, $location, $state, $filter, $uibModal, CommonServices) {
    $scope.code = "";

    var timeout = JSON.parse(localStorage.getItem('info_timeout'));

    var EmployeeData = $("#EmployeeData").data("employee");
    if (EmployeeData) {
        $scope.SmanId = EmployeeData.SmanId;
    }

    $scope.toogleActiveCall = function () {
        $rootScope.$broadcast("toogleActiveCall", { "item": {} });
    }

    $scope.toogleRecentCall = function () {
        $rootScope.$broadcast("toogleRecentCall", { "item": {} });
    }

    $rootScope.cancelReload = false;
    $scope.reload = function () {
        console.log($state.current);
        if ($state.current.name != "app.main.callcenter") {
            $rootScope.cancelReload = true;
            return;
        }
        if ($rootScope.cancelReload) {
            return;
        }
        $rootScope.$broadcast("reload", { "item": {} });
        $timeout(function () {
            $scope.reload();
            console.log(timeout.value);
        }, 1000 * 60 * timeout.value);

    };
    $scope.reload();


});