//Events
namespace('juke.events').PLAYER_PLAYING = "ActivityModel.PLAYER_PLAYING";
namespace('juke.events').PLAYER_STOPED = "ActivityModel.PLAYER_STOPED";
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
        var self = this;

        this.youtubeService.getPlayer(function(result){
            result.addEventListener('onReady', self.onPlayerReady);
            result.addEventListener('onStateChange', self.onPlayerStateChange);
            self.$scope.player = result;
            console.log(self.$scope.player);
        });

    },

    defineListeners:function(){
	this._super();
        this.notifications.addEventListener(juke.events.PLAYLIST_LOADED, this.handlePlayListLoaded.bind(this));
        this.notifications.addEventListener(juke.events.CURRENT_HUB_LOADED, this.handleHubLoaded.bind(this));
    },

    onPlayerReady:function(event){
        console.log("player Ready");
        //event.target.playVideo();
    },

    onPlayerStateChange:function(event){
        console.log("player State Change");
        //event.target.playVideo();
    },


    destroy:function(){
	this.notifications.removeEventListener(juke.events.PLAYLIST_LOADED, this.handlePlayListLoaded.bind(this));
	this.notifications.removeEventListener(juke.events.CURRENT_HUB_LOADED, this.handleHubLoaded.bind(this));
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
