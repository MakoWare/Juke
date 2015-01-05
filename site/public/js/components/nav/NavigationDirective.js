var NavigationDirective = BaseDirective.extend({

    notifications:null,
    userModel: null,

    init:function($scope, $location, notifications, usersModel, $modal){
        this.notifications = notifications;
        this.userModel = usersModel;
        this.location = $location;
        this.modal = $modal;
	this._super($scope);
        this.$scope.login = {};
        this.$scope.signUp = {};
        this.$scope.searching = false;
        this.$scope.currentUser = usersModel.currentUser;
    },

    defineListeners:function(){
        var self = this;
        $('#loginButton').click(this.login.bind(this));
        $('#logoutButton').click(this.logout.bind(this));
        $('#signUpButton').click(this.signUp.bind(this));
        $('#feedbackButton1').click(this.giveFeedBack.bind(this));
        $('#feedbackButton2').click(this.giveFeedBack.bind(this));
        $('#searchParam').keyup(this.searchChanged.bind(this));
        this.notifications.addEventListener(juke.events.USER_LOGGED_IN, this.handleUserLogin.bind(this));
        this.notifications.addEventListener(juke.events.USER_LOGGED_OUT, this.handleUserLogout.bind(this));

        this.notifications.addEventListener(juke.events.ADDING_SONGS_SHOWN, this.handleAddingSongsShown.bind(this));

        this.$scope.toggleSearch = function(){
            self.$scope.searching = !self.$scope.searching;
            if(self.$scope.searching){
                setTimeout(function() {$("#searchParam").focus(); }, 0);
            }
        };

        $("#searchParam").focusout(function() {
            self.$scope.searching = false;
            self.$scope.$apply();

        });

    },

    giveFeedBack:function(){
        var modalInstance = this.modal.open({
            templateUrl: 'partials/feedbackModal.html',
            controller: 'FeedBackModalCtrl'
        });
    },

    handleAddingSongsShown:function(){
        this.$scope.searching = true;
        setTimeout(function() {$("#searchParam").focus(); }, 0);
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
    .directive('navigation',['$location', 'Notifications', 'UsersModel', '$modal', function($location, Notifications, UsersModel, $modal){
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
		new NavigationDirective($scope, $location, Notifications, UsersModel, $modal);
	    },
	    scope:true,
            templateUrl: partial
	};
    }]);
