'use strict';

//Home Controller
var HomeCtrl = function($scope, $location, ParseService){



    //Init Controller
    $scope.init = function(){
        $scope.currentUser = ParseService.getCurrentUser();
        if($scope.currentUser == undefined){
            $location.path('/');
        }
    };

    $scope.init();
};
