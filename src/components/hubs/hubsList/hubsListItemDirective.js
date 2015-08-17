'use strict';

var HubsListItemDirective = BaseDirective.extend({
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
    },

    destroy: function(){
        this._super();
    },


});

angular.module('hubsListItem',[])
    .directive('hubsListItem', function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new HubsListItemDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/hubs/hubsList/hubsListItem.html"
        };
    });
