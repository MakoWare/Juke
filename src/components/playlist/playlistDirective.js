'use strict';

var PlaylistDirective = BaseDirective.extend({
    hubModel: null,
    songModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel, SongModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
        this.songModel = SongModel;
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
        this.$scope.hub = this.hubModel.hub;
        this.$scope.currentSong = {};
    },

    destroy: function(){
        this._super();

    },



});

angular.module('playlist',[])
    .directive('playlist', function($state, UserModel, Notifications, HubModel, SongModel){
        return {
            restrict:'E',
            link: function($scope){
                new PlaylistDirective($scope, $state, UserModel, Notifications, HubModel, SongModel);
            },
            scope: true,
            templateUrl: "partials/playlist/playlist.html"
        };
    });
