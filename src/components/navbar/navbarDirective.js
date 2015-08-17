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
        this.notifications.addEventListener(models.events.BRAND_CHANGE, this.onBrandChange.bind(this));
        $(".dropdown-button").dropdown();
    },

    defineScope: function(){
        this.$scope.currentUser = this.userModel.currentUser;
        this.$scope.logout = this.logout.bind(this);
        this.$scope.showModal = this.showModal.bind(this);
        $(".button-collapse").sideNav();
    },

    showModal: function(){
        this.notifications.notify(models.events.OPEN_ADD_HUB_MODAL);
    },

    logout: function(){
        this.userModel.logout();
    },

    onUserSignedIn: function(){
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
