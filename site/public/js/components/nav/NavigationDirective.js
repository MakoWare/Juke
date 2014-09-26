var NavigationDirective = BaseDirective.extend({

    notifications:null,
    userModel: null,

    init:function($scope, $location, notifications, usersModel){
	this.notifications = notifications;
        this.userModel = usersModel;
        this.location = $location;
	this._super($scope);
        this.$scope.login = {};
        this.$scope.signUp = {};
        this.$scope.currentUser = usersModel.currentUser;
    },

    defineListeners:function(){
        $('#loginButton').click(this.login.bind(this));
        $('#logoutButton').click(this.logout.bind(this));
        $('#signUpButton').click(this.signUp.bind(this));
        this.notifications.addEventListener(juke.events.USER_LOGGED_IN, this.handleUserLogin.bind(this));
        this.notifications.addEventListener(juke.events.USER_LOGGED_OUT, this.handleUserLogout.bind(this));
    },

    login:function(){
        this.userModel.login(this.$scope.login.username, this.$scope.login.password);
    },

    logout:function(){
        this.userModel.logout();
    },

    signUp:function(){
        this.userModel.signUp(this.$scope.login.username, this.$scope.login.password);
    },

    handleUserLogin:function(){
        console.log("oh, I see a user logged in");
        this.$scope.currentUser = this.userModel.currentUser;
        this.$scope.$apply(); //may not need this
    },

    handleUserLogout:function(){
        console.log("oh, I see a user logged out");
        this.$scope.currentUser = this.userModel.currentUser;
        this.$scope.$apply(); //may not need this
    }

});

angular.module('navigation',[])
    .directive('navigation',['$location', 'Notifications', 'UsersModel', function($location, Notifications, UsersModel){
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavigationDirective($scope, $location, Notifications, UsersModel);
	    },
	    scope:true,
            templateUrl: 'partials/nav.html?e=335'
	};
    }]);
