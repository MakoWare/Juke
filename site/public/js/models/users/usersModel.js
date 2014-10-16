//Events
namespace('juke.events').USER_LOGGED_IN = "ActivityModel.USER_LOGGED_IN";
namespace('juke.events').USER_LOGGED_OUT = "ActivityModel.USER_LOGGED_OUT";
namespace('juke.events').FOUND_USER_BY_USERNAME = "ActivityModel.FOUND_USER_BY_USERNAME";

//Users model
var UsersModel = EventDispatcher.extend({

    //Injected by the provider
    ParseService:null,
    notifications: null,
    currentUser: null,
    viewingUser: null,

    //Attempt Login
    login:function(username, password){
        var self = this;
	this.ParseService.login(username, password).then(function(result){
            self.currentUser = result;
            self.notifications.notify(juke.events.USER_LOGGED_IN);
        });
    },

    //Logout
    logout:function(){
	this.ParseService.logout();
        this.currentUser = null;
        this.notifications.notify(juke.events.USER_LOGGED_OUT);
    },

    //Sign Up
    signUp:function(username, password){
        var self = this;
	this.ParseService.signUp(username, password).then(function(result){
            self.currentUser = result;
            self.notifications.notify(juke.events.USER_LOGGED_IN);
        });
    },

    //Get User by username
    getUserByUsername:function(username){
        var self = this;
	this.ParseService.getUserByUsername(username).then(function(result){
            console.log(result);
            if(result){
                self.viewingUser = result;
                self.notifications.notify(juke.events.FOUND_USER_BY_USERNAME);
            } else {
                alert("No User Found!");
            }
        });
    }

});


(function (){
    var UsersModelProvider = Class.extend({
	instance: new UsersModel(),

        //Init UserModel, Should I attempt to pull Parse.User.current() here?
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
            this.instance.currentUser = ParseService.getCurrentUser();
	    return this.instance;
	}]
    });

    angular.module('juke.UsersModel',[])
	.provider('UsersModel' , UsersModelProvider);
}());
