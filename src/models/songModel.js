'use strict';

namespace('models.events').SONG_ADDED = "ActivityModel.SONG_ADDED";


var SongModel = EventDispatcher.extend({
    song: null,
    songs: [],
    playingSong: null,
    nextSong: null,
    queuedSongs: [],
    ParseService:null,
    notifications: null,

    addSong: function(song){
        //Check permisions before sending req
        return this.ParseService.addSong(song).then(function(song){
            return song;
        }.bind(this), function(error){
            return error;
        });
    },

    getNextSong: function(hubId){
        return this.ParseService.getNextSong(hubId).then(function(song){
            this.nextSong = song;
            return song;
        }.bind(this), function(error){
            return error;
        });
    },

    findSongs: function(searchParams){
        return this.findYouTubeSongs(searchParams);
    },

    findYouTubeSongs: function(searchParams){
        var request = gapi.client.youtube.search.list({
            q: searchParams.text,
            maxResults: 10,
            part: 'snippet'
        });

        return request.execute(function(response) {
            console.log(response);
            var str = JSON.stringify(response.result);
            $('#search-container').html('<pre>' + str + '</pre>');
        });
    }

});


(function (){
    var SongModelProvider = Class.extend({
        instance: new SongModel(),

        $get: function(ParseService, Notifications){
            this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
            return this.instance;
        }
    });

    angular.module('SongModel',[])
        .provider('SongModel', SongModelProvider);
}());
