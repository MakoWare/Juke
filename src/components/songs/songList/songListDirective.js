'use strict';

var SongListDirective = BaseDirective.extend({
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
        this.onSongsFound = this.onSongsFound.bind(this);
        this.notifications.addEventListener(models.events.SONGS_FOUND, this.onSongsFound);
    },

    defineScope: function(){
        this._super();
        this.$scope.hub = this.hubModel.hub;
        this.$scope.youtubeSongs = this.songModel.foundYoutubeSongs;
    },

    destroy: function(){
        this._super();
        this.notifications.removeEventListener(models.events.SONGS_FOUND, this.onSongsFound);
    },

    onSongsFound: function(){
        this.$scope.songs = this.songModel.foundSongs;
        console.log(this.$scope.songs);
    }


});

angular.module('songList',[])
    .directive('songList', function($state, UserModel, Notifications, HubModel, SongModel){
        return {
            restrict:'E',
            link: function($scope){
                new SongListDirective($scope, $state, UserModel, Notifications, HubModel, SongModel);
            },
            scope: true,
            templateUrl: "partials/songs/songList/songList.html"
        };
    });
