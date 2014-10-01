//Events
namespace('juke.events').SONGS_FOUND = "ActivityModel.SONGS_FOUND";
namespace('juke.events').PLAYLIST_LOADED = "ActivityModel.PLAYLIST_LOADED";

//Hubs model, holds hubs
var SongsModel = EventDispatcher.extend({
    currentSong: null,
    songs: null,
    foundSongs:null,
    playlist:null,

    //Injected by the provider
    ParseService:null,
    YouTubeService:null,
    notifications: null,
    usersModel: null,
    hubsModel: null,

    //Search YouTube for songs
    findYoutubeSongs:function(query){
        var self = this;
	this.YouTubeService.search(query, function(results){
            self.foundSongs = results.items;
            self.notifications.notify(juke.events.SONGS_FOUND);
        });
    },

    //Add a YouTubeSong to the current Hub
    addYouTubeSong:function(song){
        var self = this;
        var canAdd = this.canAddSong();
        if(typeof canAdd != "string"){
            var submittedSong = jQuery.parseJSON(song);
            this.ParseService.addYouTubeSong(this.hubsModel.currentHub, submittedSong).then(function(results){
                self.playlist = results;
                self.currentSong = results[0]; //Not Sure if this is a good idea
                self.notifications.notify(juke.events.PLAYLIST_LOADED);
            });
        } else {
            alert("Sorry, you can't add a song because " + canAdd);
        }
    },

    //Check to see if the User can add a song to the current Hub
    canAddSong:function(){
        if(!this.usersModel.currentUser){
            return "you must log in to add songs to this Hub.";
        }

        if(this.hubsModel.currentHub.get('rate') ){

        }
        return true;
    },

    //Get Playlist
    getPlaylist:function(){
        var self = this;
        this.ParseService.getPlaylist(this.hubsModel.currentHub.id).then(function(results){
            self.playlist = results;
            self.currentSong = results[0]; //Not Sure if this is a good idea
            self.notifications.notify(juke.events.PLAYLIST_LOADED);
        });
    }

});

//Provider, as all components will use the same HubsModel instance, $inject will init once, then pull the same object from Instance Cache for all other $injects
(function (){
    var SongsModelProvider = Class.extend({
	instance: new SongsModel(),

        //Init HubsModel
	$get:['ParseService', 'YouTubeService', 'Notifications', 'UsersModel', 'HubsModel', function(ParseService, YouTubeService, Notifications, UsersModel, HubsModel){
	    this.instance.ParseService = ParseService;
	    this.instance.YouTubeService = YouTubeService;
            this.instance.notifications = Notifications;
            this.instance.usersModel = UsersModel;
            this.instance.hubsModel = HubsModel;
	    return this.instance;
	}]
    });

    angular.module('juke.SongsModel',[])
	.provider('SongsModel', SongsModelProvider);
}());
