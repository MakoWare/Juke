'use strict';

//Modal Controller
var ModalCtrl = function($scope, $modalInstance, hub) {
    $scope.hub = hub;
    
    $scope.ok = function () {
	$modalInstance.close($scope.hub);
    };
    
    $scope.cancel = function () {
	$modalInstance.dismiss('cancel');
    };

};
