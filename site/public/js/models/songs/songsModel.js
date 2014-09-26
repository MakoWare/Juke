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

    //Search YouTube for songs
    findYoutubeSongs: function(query){
        var self = this;
	this.YouTubeService.search(query, function(results){
            self.foundSongs = results;
            console.log(results);
            self.notifications.notify(juke.events.SONGS_FOUND);
        });
    }

});

//Provider, as all components will use the same HubsModel instance, $inject will init once, then pull the same object from Instance Cache for all other $injects
(function (){
    var SongsModelProvider = Class.extend({
	instance: new SongsModel(),

        //Init HubsModel
	$get:['ParseService', 'YouTubeService', 'Notifications', function(ParseService, YouTubeService, Notifications){
	    this.instance.ParseService = ParseService;
	    this.instance.YouTubeService = YouTubeService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('juke.SongsModel',[])
	.provider('SongsModel', SongsModelProvider);
}());
