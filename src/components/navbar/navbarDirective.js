'use strict';

namespace('models.events').BRAND_CHANGE = "ActivityModel.BRAND_CHANGE";

var NavBarDirective = BaseDirective.extend({
    userModel: null,
    notifications: null,

    initialize: function($scope, $rootScope, $state, $timeout, UserModel, Notifications, HubModel){
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$timeout = $timeout;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this.notifications.addEventListener(models.events.USER_SIGNED_IN, this.onUserSignedIn.bind(this));
        this.$scope.logout = this.logout.bind(this);
        this.$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            this.$scope.state = toState.name;
        }.bind(this));
        $(".dropdown-button").dropdown();
    },

    defineScope: function(){
        this.navShowing = false;
        this.$scope.currentUser = this.userModel.currentUser;
        $(".button-collapse").sideNav();

    },

    logout: function(){
        this.userModel.logout();
        this.$location.url("/");
    },

    onUserSignedIn: function(){
        this.$scope.currentUser = this.userModel.currentUser;
    }

});

angular.module('navbar',[])
    .directive('navbar', function($rootScope, $state, $timeout, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            isolate:true,
            link: function($scope){
                new NavBarDirective($scope, $rootScope, $state, $timeout, UserModel, Notifications, HubModel);
            },
            scope:true,
            templateUrl: "partials/navbar/navbar.html"
        };
    });
