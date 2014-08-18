'use strict';

//Hubs Table Controller
var HubsTableCtrl = function($scope, $location, ParseService){

    //Get Popular Hubs
    $scope.getPopularHubs = function(){
        $scope.$apply(function(){
            ParseService.getPopularHubs(function(results){
                $scope.hubs = results;
            });
        });
    },

    //Find Hubs  *** Add Query ***
    $scope.findHubs = function(){
        $scope.$apply(function(){
            ParseService.getGetHubs(function(results){
                $scope.hubs = results;
            });
        });
    },

    //Init Controller
    $scope.init = function(){
        $scope.hubs = {};
        $scope.getPopularHubs();
    };

    $scope.init();
};
