UserWebApp.controller('CampaignModalCtrl', function($scope, item, $translate, $uibModalInstance) {

    var $ctrl = this;

    $scope.VehicleNotifications = item;

    $ctrl.ok = function() {
        $uibModalInstance.close($ctrl.selected);
    };

    $ctrl.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };


});