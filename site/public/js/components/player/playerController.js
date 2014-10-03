//Events
namespace('juke.events').PLAYER_PLAYING = "ActivityModel.PLAYER_PLAYING";
namespace('juke.events').PLAYER_STOPED = "ActivityModel.PLAYER_STOPED";
namespace('juke.events').PLAYER_STATE_CHANGE = "ActivityModel.PLAYER_STATE_CHANGE";
namespace('juke.events').PLAYER_NEXTSONG = "ActivityModel.PLAYER_NEXTSONG";

var PlayerCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,
    songsModel: null,
    usersModel: null,
    youtubeService: null,

    init:function($scope, HubsModel, SongsModel, UsersModel, YouTubeService, Notifications){
        console.log("PlayerCtrl.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.songsModel = SongsModel;
        this.usersModel = UsersModel;
        this.youtubeService = YouTubeService;
        this._super($scope);
    },

    defineScope:function(){
	this.$scope.instance="PlayerController";
        this.$scope.currentSong = this.songsModel.currentSong;
        this.$scope.playList = this.songsModel.playList;
        this.$scope.playing = false;
    },

    defineListeners:function(){
	this._super();
        this.notifications.addEventListener(juke.events.PLAYLIST_LOADED, this.handlePlayListLoaded.bind(this));
        this.notifications.addEventListener(juke.events.CURRENT_HUB_LOADED, this.handleHubLoaded.bind(this));
        this.notifications.addEventListener(juke.events.PLAYER_STATE_CHANGE, this.handlePlayerStateChange.bind(this));
        var self = this;
        window.onYouTubeIframeAPIReady = function() {
            self.$scope.player = new YT.Player('player', {
                width: '240',
                height: '160',
                playerVars: { 'controls': 0, 'disablekb': 1, 'iv_load_policy': 3, 'showinfo': 0},
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };

        function onPlayerReady(event){
            console.log("player Ready");
            function loadSong(){
                var currentSong = self.songsModel.currentSong.get('song');
                if(currentSong.get('type') == 'youtube'){
                    self.$scope.player.loadVideoById(currentSong.get('pId'));
                }
            }

            if(!self.songsModel.currentSong){
                console.log("waiting");
                setTimeout(loadSong, 1000);
            } else {
                loadSong();
            }

        };

        function onPlayerStateChange(event){
            self.notifications.notify(juke.events.PLAYER_STATE_CHANGE, event);
            //event.target.playVideo();
        };
    },


    destroy:function(){
	this.notifications.removeEventListener(juke.events.PLAYLIST_LOADED, this.handlePlayListLoaded.bind(this));
	this.notifications.removeEventListener(juke.events.CURRENT_HUB_LOADED, this.handleHubLoaded.bind(this));
        this.notifications.removeEventListener(juke.events.PLAYER_STATE_CHANGE, this.handlePlayerStateChange.bind(this));

    },

    handlePlayerStateChange:function(event, playerEvent){
        console.log("handling state change");
        switch (playerEvent.data) {
        case -1:
            console.log("unstarted");

            break;
        case 0:
            console.log("ended");

            break;
        case 1:
            console.log("playing");

            break;
        case 2:
            console.log("paused");

            break;
        case 3:
            console.log("buffering");

            break;
        case 5:
            console.log("video cued");

            break;
        }

    },

    handlePlayListLoaded:function(){
        this.$scope.playList = this.songsModel.playList;
        this.$scope.currentSong = this.songsModel.currentSong;
        this.$scope.$apply();
    },

    handleHubLoaded:function(){
        this.songsModel.getPlaylist();
        if(this.usersModel.currentUser.id == this.hubsModel.currentHub.get('owner').id){
            this.$scope.playing = true;
        } else {

        }
    }

});

PlayerCtrl.$inject = ['$scope', 'HubsModel', 'SongsModel', 'UsersModel', 'YouTubeService', 'Notifications'];
