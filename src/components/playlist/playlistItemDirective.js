'use strict';

var PlaylistItemDirective = BaseDirective.extend({
    hubModel: null,
    songModel: null,
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

angular.module('playlistItem',[])
    .directive('playlistItem', function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new PlaylistItemDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/playlist/playlistItem.html"
        };
    });
