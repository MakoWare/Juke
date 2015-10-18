'use strict';

var HubListItemDirective = BaseDirective.extend({
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

angular.module('hubListItem',[])
    .directive('hubListItem', function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new HubListItemDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/hubs/hubList/hubListItem.html"
        };
    });
