'use strict';

var HubsListDirective = BaseDirective.extend({
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
        this.$scope.hubs = [1, 2];

    },

    destroy: function(){
        this._super();
    },


});

angular.module('hubsList',[])
    .directive('hubsList', function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new HubsListDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope: false,
            templateUrl: "partials/hubs/hubsList/hubsList.html"
        };
    });
