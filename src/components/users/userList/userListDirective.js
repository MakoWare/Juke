'use strict';

var UserListDirective = BaseDirective.extend({
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

angular.module('userList',[])
    .directive('userList', function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new UserListDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope: false,
            templateUrl: "partials/users/userList/userList.html"
        };
    });
