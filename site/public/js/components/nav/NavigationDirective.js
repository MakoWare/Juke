var NavigationDirective = BaseDirective.extend({

    notifications:null,
    userModel: null,

    init:function($scope, $location, notifications, userModel){
        console.log("NavigationDirective.init()");
	this.notifications = notifications;
        this.userModel = userModel;
        this.location = $location;
	this._super($scope);
        this.$scope.login = {};
        this.$scope.signUp = {};
    },

    defineListeners:function(){
        $('#loginButton').click(this.login.bind(this));
        this.notifications.addEventListener(juke.events.USER_LOGGED_IN, this.handleUserLogin.bind(this));
        this.notifications.addEventListener(juke.events.USER_LOGGED_OUT, this.handleUserLogout.bind(this));
    },


    login:function(){
        this.userModel.login(this.$scope.login.username, this.$scope.login.password);
    },

    handleUserLogin:function(){
        console.log("oh, I see a user logged in");
    },

    handleUserLogout:function(){

    }


});

angular.module('navigation',[])
    .directive('navigation',['$location', 'Notifications', 'UserModel', function($location, Notifications, UserModel){
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavigationDirective($scope, $location, Notifications, UserModel);
	    },
	    scope:true,
            templateUrl: 'partials/nav.html?e=335'
	};
    }]);
