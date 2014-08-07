'use strict';

//Login Controller
var LoginCtrl = function($scope, $location, GlobalService, ParseService){

    //Sign Up
    $scope.signUp = function(){
        ParseService.signUp($scope.signUp.username, $scope.signUp.password, function(results){
            if(results != undefined){
		$location.path('/hubs');
		$scope.$apply();
	    }
        });
    };

    //Login
    $scope.login = function(){
	ParseService.login($scope.login.username, $scope.login.password, function(user){
	    if(user != undefined){
		$location.path('/hubs');
		$scope.$apply();
	    }
	});
    };

    //Reset Password
    $scope.resetPassword = function(){
        ParseService.resetPassword();
    };

    //Logout
    $scope.logout = function(){
	ParseService.logout();
    };

    //Init
    $scope.init = function(){
	$scope.logout();
	$scope.isMobile = GlobalService.isMobile;
    };

    $scope.init();
};
