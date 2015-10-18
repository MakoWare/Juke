'use strict';

var HubListDirective = BaseDirective.extend({
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
        this.$scope.hubs = this.hubModel.hubs;
        console.log(this.$scope.hubs);
    },

    destroy: function(){
        this._super();
    },


});

angular.module('hubList',[])
    .directive('hubList', function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new HubListDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope: false,
            templateUrl: "partials/hubs/hubList/hubList.html"
        };
    });
