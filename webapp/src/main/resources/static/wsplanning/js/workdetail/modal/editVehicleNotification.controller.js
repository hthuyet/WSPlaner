UserWebApp.controller('EditVehicleNotificationCtrl', function($scope, item, $translate, $uibModalInstance) {

    var $ctrl = this;

    console.log(item)
    $scope.item = item;


    $ctrl.save = function() {
        $uibModalInstance.close($scope.item);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };


});