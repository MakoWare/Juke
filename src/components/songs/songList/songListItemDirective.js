'use strict';

var SongListItemDirective = BaseDirective.extend({
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
        this.$scope.addSong = this.addSong.bind(this);
        //console.log(this.$scope.song);
    },

    destroy: function(){
        this._super();
    },

    addSong: function(){
        console.log("add");
        this.notifications.notify(models.events.SHOW_LOADING);
        this.hubModel.addSongToPlaylist(this.$scope.song).then(function(results){
            this.notifications.notify(models.events.HIDE_LOADING);
            Materialize.toast('Song added!', 2000, '');
        }.bind(this));
    }

});

angular.module('songListItem',[])
    .directive('songListItem', function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new SongListItemDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/songs/songList/songListItem.html"
        };
    });
