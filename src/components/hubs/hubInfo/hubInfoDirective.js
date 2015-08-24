'use strict';

var HubInfoDirective = BaseDirective.extend({
    hubModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
        this.currentUser = this.userModel.currentUser;
        this.hub = this.hubModel.hub;
    },

    destroy: function(){
        this._super();
    }


});

angular.module('hubInfo',[])
    .directive('hubInfo', function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new HubInfoDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/hubs/hubInfo/hubInfo.html"
        };
    });
