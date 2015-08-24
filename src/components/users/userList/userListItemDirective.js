'use strict';

var UserListItemDirective = BaseDirective.extend({
    hubModel: null,
    userModel: null,
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

angular.module('userListItem',[])
    .directive('userListItem', function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new UserListItemDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/users/userList/userListItem.html"
        };
    });
