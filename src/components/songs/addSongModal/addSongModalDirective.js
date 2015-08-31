'use strict';

namespace('models.events').OPEN_ADD_SONG_MODAL = "ActivityModel.OPEN_ADD_SONG_MODAL";

var AddSongModalDirective = BaseDirective.extend({
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
        this.onOpenModal = this.onOpenModal.bind(this);
        this.notifications.addEventListener(models.events.OPEN_ADD_SONG_MODAL, this.onOpenModal);
    },

    defineScope: function(){
        this._super();
        this.$scope.findSongs = this.findSongs.bind(this);
        this.$scope.searchParams = {};
    },

    destroy: function(){
        this._super();
        this.notifications.removeEventListener(models.events.OPEN_ADD_SONG_MODAL, this.onOpenModal);
    },

    onOpenModal: function(){
        $('#addSongModal').openModal();
    },

    findSongs: function(){
        this.songModel.findSongs(this.$scope.searchParams);
    }


});

angular.module('addSongModal',[])
    .directive('addSongModal', function($state, UserModel, Notifications, HubModel, SongModel){
        return {
            restrict:'E',
            link: function($scope){
                new AddSongModalDirective($scope, $state, UserModel, Notifications, HubModel, SongModel);
            },
            scope: true,
            templateUrl: "partials/songs/addSongModal/addSongModal.html"
        };
    });
