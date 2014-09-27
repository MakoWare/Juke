//Events
namespace('juke.events').SONGS_FOUND = "ActivityModel.SONGS_FOUND";

//Hubs model, holds hubs
var SongsModel = EventDispatcher.extend({
    currentSong: null,
    songs: null,
    foundSongs:null,

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
            console.log(self.foundSongs);
            self.notifications.notify(juke.events.SONGS_FOUND);
        });
    },

    //Add a YouTubeSong to the current Hub
    addYouTubeSong:function(song){
        var canAdd = this.canAddSong();
        if(typeof canAdd != "string"){
            console.log(song);
            var submittedSong = jQuery.parseJSON(song);
            console.log(submittedSong);
            this.ParseService.addYouTubeSong(this.hubsModel.currentHub, submittedSong).then(function(result){

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
