//Events
namespace('juke.events').USER_LOGGED_IN = "ActivityModel.USER_LOGGED_IN";
namespace('juke.events').USER_LOGGED_OUT = "ActivityModel.USER_LOGGED_OUT";

//User model, holds Current User
var UserModel = EventDispatcher.extend({

    //Injected by the provider
    ParseService:null,
    notifications: null,
    currentUser: null,

    //Attempt Login
    login:function(username, password){
        console.log(username + password);
        var self = this;
	this.ParseService.login(username, password).then(function(result){
            console.log("User logged in");
            self.currentUser = result;
            self.notifications.notify(juke.events.USER_LOGGED_IN);
        });
    }


});


(function (){
    var UserModelProvider = Class.extend({
	instance: new UserModel(),

        //Init UserModel, Should I attempt to pull Parse.User.current() here?
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
            this.instance.currentUser = ParseService.getCurrentUser();
	    return this.instance;
	}]
    });

    angular.module('juke.UserModel',[])
	.provider('UserModel' , UserModelProvider);
}());
