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

    //Search YouTube for songs
    findYoutubeSongs:function(query){
        var self = this;
	this.YouTubeService.search(query, function(results){
            self.foundSongs = results.items;
            console.log(self.foundSongs);
            self.notifications.notify(juke.events.SONGS_FOUND);
        });
    },

    //Add a song to the current Hub
    addSong:function(songId){
        var canAdd = this.canAddSong();
        if(canAdd && typeof canAdd != "string"){


        } else {
            alert("Sorry, you can't add a song because " + canAdd);
        }
    },

    //Check to see if the User can add a song to the current Hub
    canAddSong:function(){
        if(!this.usersModel.currentUser){
            return "you must log in to add songs to this Hub.";
        }


        return true;
    }

});

//Provider, as all components will use the same HubsModel instance, $inject will init once, then pull the same object from Instance Cache for all other $injects
(function (){
    var SongsModelProvider = Class.extend({
	instance: new SongsModel(),

        //Init HubsModel
	$get:['ParseService', 'YouTubeService', 'Notifications', 'UsersModel', function(ParseService, YouTubeService, Notifications, UsersModel){
	    this.instance.ParseService = ParseService;
	    this.instance.YouTubeService = YouTubeService;
            this.instance.notifications = Notifications;
            this.instance.usersModel = UsersModel;
	    return this.instance;
	}]
    });

    angular.module('juke.SongsModel',[])
	.provider('SongsModel', SongsModelProvider);
}());
