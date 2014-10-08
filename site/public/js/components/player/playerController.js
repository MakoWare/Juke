//Events
namespace('juke.events').PLAYER_PLAYING = "ActivityModel.PLAYER_PLAYING";
namespace('juke.events').PLAYER_STOPED = "ActivityModel.PLAYER_STOPED";


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
        this.$scope.player = {};
        this.$scope.player.state = "stopped";
        this.$scope.player.ytPlayerReady = false;
        this.$scope.player.ytPlayerState = -1;
    },

    defineListeners:function(){
	this._super();
        this.notifications.addEventListener(juke.events.PLAYLIST_LOADED, this.handlePlayListLoaded.bind(this));
        this.notifications.addEventListener(juke.events.CURRENT_HUB_LOADED, this.handleHubLoaded.bind(this));
        this.notifications.addEventListener(juke.events.PLAYER_STATE_CHANGE, this.handlePlayerStateChange.bind(this));
        this.notifications.addEventListener(juke.events.YOUTUBE_READY, this.handleYoutubeReady.bind(this));

    },

    handleYoutubeReady:function(event, playerEvent){
        this.$scope.player.ytPlayer = playerEvent.target;
        if(this.$scope.player.state == "stopped"){
            this.playNextSong();
        }
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

    playYoutubeSong:function(){
        var currentSong = this.songsModel.currentSong.get('song');
        if(this.$scope.player.ytPlayer){
            console.log(this.$scope.player.ytPlayer);
            console.log(currentSong.get('pId'));
            this.$scope.player.ytPlayer.loadVideoById(currentSong.get('pId'));
        }
    },

    playNextSong:function(){
        var queuedSong = this.songsModel.currentSong;
        var currentSong = queuedSong.get('song');
        switch (currentSong.get('type')) {
            case "youtube":
            this.playYoutubeSong();
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
        var currentUser = this.usersModel.currentUser;
        if(currentUser && currentUser.id == this.hubsModel.currentHub.get('owner').id){
            this.$scope.playing = true;
        } else {
            this.$scope.playing = true;
        }
    },

    destroy:function(){
	this.notifications.removeEventListener(juke.events.PLAYLIST_LOADED, this.handlePlayListLoaded.bind(this));
	this.notifications.removeEventListener(juke.events.CURRENT_HUB_LOADED, this.handleHubLoaded.bind(this));
        this.notifications.removeEventListener(juke.events.PLAYER_STATE_CHANGE, this.handlePlayerStateChange.bind(this));

    }

});

PlayerCtrl.$inject = ['$scope', 'HubsModel', 'SongsModel', 'UsersModel', 'Notifications'];
