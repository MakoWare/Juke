'use strict';

//Home Controller
var HomeCtrl = function($scope, $location, ParseService){

    //Login
    $scope.login = function(){
        ParseService.login($scope.login.username, $scope.login.password);
    },

    //SignUp
    $scope.signUp = function(){
        ParseService.signUp($scope.login.username, $scope.login.password);
    },

    //Init Controller
    $scope.init = function(){
        $scope.signUp = {};
    };

    $scope.init();
};
