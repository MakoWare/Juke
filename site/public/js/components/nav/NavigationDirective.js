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
        this.$scope.searching = false;
        this.$scope.currentUser = usersModel.currentUser;
    },

    defineListeners:function(){
        $('#loginButton').click(this.login.bind(this));
        $('#logoutButton').click(this.logout.bind(this));
        $('#signUpButton').click(this.signUp.bind(this));
        $('#searchParam').keyup(this.searchChanged.bind(this));
        this.notifications.addEventListener(juke.events.USER_LOGGED_IN, this.handleUserLogin.bind(this));
        this.notifications.addEventListener(juke.events.USER_LOGGED_OUT, this.handleUserLogout.bind(this));

        this.$scope.toggleSearch = function(){
            this.searching = !this.searching;
        };
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

    searchChanged:function(){
        var query = $('#searchParam').val();
        this.notifications.notify(juke.events.SEARCH_CHANGED,  query);
    },

    handleUserLogin:function(){
        this.$scope.currentUser = this.userModel.currentUser;
        this.$scope.$apply(); //may not need this
    },

    handleUserLogout:function(){
        this.$scope.currentUser = this.userModel.currentUser;
        this.$scope.$apply(); //may not need this
    }

});

angular.module('navigation',[])
    .directive('navigation',['$location', 'Notifications', 'UsersModel', function($location, Notifications, UsersModel){

        var partial;
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            partial = "partials/nav/navMobile.html";
        } else {
            partial = "partials/nav/navDesktop.html";
        }

	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavigationDirective($scope, $location, Notifications, UsersModel);
	    },
	    scope:true,
            templateUrl: partial
	};
    }]);
