//Events
namespace('juke.events').PLAYER_PLAYING = "ActivityModel.PLAYER_PLAYING";
namespace('juke.events').PLAYER_STOPED = "ActivityModel.PLAYER_STOPED";
namespace('juke.events').PLAYER_STATE_CHANGE = "ActivityModel.PLAYER_STATE_CHANGE";

var PlayerCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,
    songsModel: null,
    usersModel: null,

    init:function($scope, HubsModel, SongsModel, UsersModel, Notifications){
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.songsModel = SongsModel;
        this.usersModel = UsersModel;
        this._super($scope);
    },

    defineScope:function(){
	this.$scope.instance="PlayerController";
        this.$scope.currentSong = this.songsModel.currentSong;
        this.$scope.playList = this.songsModel.playList;
        this.$scope.playerLoaded = false;
        this.$scope.playerState = -1;
    },

    defineListeners:function(){
	this._super();
        this.notifications.addEventListener(juke.events.PLAYLIST_LOADED, this.handlePlayListLoaded.bind(this));
        this.notifications.addEventListener(juke.events.CURRENT_HUB_LOADED, this.handleHubLoaded.bind(this));
        this.notifications.addEventListener(juke.events.PLAYER_STATE_CHANGE, this.handlePlayerStateChange.bind(this));
        var self = this;
        window.onYouTubeIframeAPIReady = function() {
            self.$scope.player = new YT.Player('player', {
                width: '140',
                height: '120',
                playerVars: { 'controls': 0, 'disablekb': 1, 'iv_load_policy': 3, 'showinfo': 0},
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };

        function onPlayerReady(event){
            self.$scope.playerLoaded = true;
            if(!self.songsModel.currentSong || self.$scope.playerState == -1){
                self.songsModel.getPlaylist();
            }
        };

        function onPlayerStateChange(event){
            self.notifications.notify(juke.events.PLAYER_STATE_CHANGE, event);
        };
    },

    destroy:function(){
	this.notifications.removeEventListener(juke.events.PLAYLIST_LOADED, this.handlePlayListLoaded.bind(this));
	this.notifications.removeEventListener(juke.events.CURRENT_HUB_LOADED, this.handleHubLoaded.bind(this));
        this.notifications.removeEventListener(juke.events.PLAYER_STATE_CHANGE, this.handlePlayerStateChange.bind(this));

    },

    handlePlayerStateChange:function(event, playerEvent){
        switch (playerEvent.data) {
        case -1:
            console.log("unstarted");
            this.$scope.playerState = -1;
            break;
        case 0:
            console.log("ended");
            this.$scope.playerState = 0;
            this.songsModel.nextSong();
            break;
        case 1:
            console.log("playing");
            this.$scope.playerState = 1;
            break;
        case 2:
            console.log("paused");
            this.$scope.playerState = 2;

            break;
        case 3:
            console.log("buffering");
            this.$scope.playerState = 3;

            break;
        case 5:
            console.log("video cued");
            this.$scope.playerState = 5;
            break;
        }
    },

    handlePlayListLoaded:function(){
        this.$scope.playList = this.songsModel.playList;
        this.$scope.currentSong = this.songsModel.currentSong;
        this.$scope.$apply();

        //Don't load song if player is already playing
        if(!(this.$scope.playerState == 1) && !(this.$scope.playerState == 3)){
            //loadSong
            var queuedSong = this.songsModel.currentSong;
            if(queuedSong){
                var currentSong = queuedSong.get('song');
                if(currentSong.get('type') == "youtube"){
                    if(this.$scope.playerLoaded){
                        if(this.$scope.player){
                            this.$scope.player.loadVideoById(currentSong.get('pId'));
                        }
                    }
                }
            }
        }

    },

    handleHubLoaded:function(){
        this.songsModel.getPlaylist();
        var currentUser = this.usersModel.currentUser;
        if(currentUser && currentUser.id == this.hubsModel.currentHub.get('owner').id){
            this.$scope.playing = true;
        } else {

        }
    }

});

PlayerCtrl.$inject = ['$scope', 'HubsModel', 'SongsModel', 'UsersModel', 'Notifications'];
