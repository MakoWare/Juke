//Events

var SongFinderCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, SongsModel, Notifications){
        console.log("SongFinderCtrl.init()");
        this.notifications = Notifications;
        this.songsModel = SongsModel;
        this._super($scope);
    },

    defineScope:function(){
	this.$scope.instance="SongFinderController";
        this.$scope.foundSongs = [];
    },

    defineListeners:function(){
	this._super();

	this.notifications.addEventListener(juke.events.SONGS_SEARCH, this.handleSongsSearch.bind(this));
	this.notifications.addEventListener(juke.events.SONGS_FOUND, this.handleSongsFound.bind(this));
	this.notifications.addEventListener(juke.events.SONGS_ADD, this.handleSongAdd.bind(this));
    },

    handleSongsSearch:function(event, query){
        //Just search YouTube for now, this is easily extendable
        this.songsModel.findYoutubeSongs(query);
    },

    handleSongsFound:function(){
        this.$scope.foundSongs = this.songsModel.foundSongs;
        this.$scope.$apply();
    },

    handleSongAdd:function(event, songId){
        console.log("adding song " + songId);
        this.songsModel.addSong(songId);
    },


    destroy:function(){

    }

});

SongFinderCtrl.$inject = ['$scope', 'SongsModel', 'Notifications'];
