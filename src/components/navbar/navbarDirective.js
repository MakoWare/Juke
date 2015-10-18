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
        this.notifications.addEventListener(models.events.USER_SIGNED_OUT, this.onUserSignedOut.bind(this));
        this.notifications.addEventListener(models.events.BRAND_CHANGE, this.onBrandChange.bind(this));

    },

    defineScope: function(){
        this.$scope.currentUser = this.userModel.currentUser;
        this.$scope.signOut = this.signOut.bind(this);
        this.$scope.openAddHubModal = this.openAddHubModal.bind(this);
        this.$scope.openLoginModal = this.openLoginModal.bind(this);

        $(".userDropdownButton").dropdown();
        $(".button-collapse").sideNav();
    },

    openAddHubModal: function(){
        this.notifications.notify(models.events.OPEN_ADD_HUB_MODAL);
    },

    openLoginModal: function(){
        this.notifications.notify(models.events.OPEN_LOGIN_MODAL);
    },

    signOut: function(){
        this.notifications.notify(models.events.SHOW_LOADING);
        this.userModel.signOut().then(function(){
            this.notifications.notify(models.events.HIDE_LOADING);
        });
    },

    onUserSignedIn: function(){
        this.$scope.currentUser = this.userModel.currentUser;
        $(".dropdown-button").dropdown();
    },

    onUserSignedOut: function(){
        this.$scope.currentUser = this.userModel.currentUser;
    },


    onBrandChange: function(event, brand){
        this.$scope.brand = brand;
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
