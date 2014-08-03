'use strict';

//Login Controller
var LoginCtrl = function($scope, $location, ParseService){
    //Sign Up
    $scope.signUp = function(){
        var user = new Parse.User();
        user.set('username', $scope.signUp_username);
        user.set('email', $scope.signUp_email);
        user.set('password', $scope.signUp_password);
        user.signUp(null, {
            success: function(user){
	        if(user != undefined){
		    $location.path('/hubs');
		    $scope.$apply();
	        }
            },
            error: function(user, error){
                alert("Error: " + error.message);
            }
	});
    };

    //Login
    $scope.login = function(){
	var username = $scope.login.username;
	var password = $scope.login.password;
	ParseService.login(username, password, function(user){
	    if(user != undefined){
		$location.path('/hubs');
		$scope.$apply();
	    }
	});
    };

    //Reset Password
    $scope.resetPassword = function(){
        Parse.User.requestPasswordReset($scope.emailReset, {
            success: function() {
                alert("An email was sent to you");
            },
            error: function(error) {
                alert("Error: " + error.message);
            }
        });
    };

    //Logout
    $scope.logout = function(){
	ParseService.logout();
    };

    //Init
    $scope.init = function(){
	$scope.logout();
    };

    $scope.init();
};
