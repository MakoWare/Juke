'use strict';

namespace('models.events').SONG_ADDED = "ActivityModel.SONG_ADDED";
namespace('models.events').SONGS_FOUND = "ActivityModel.SONG_FOUND";


var SongModel = EventDispatcher.extend({
    song: null,
    songs: [],
    playingSong: null,
    nextSong: null,
    queuedSongs: [],
    foundSongs: [],
    ParseService:null,
    notifications: null,

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
        var deferred = this.$q.defer();
        var request = gapi.client.youtube.search.list({
            q: searchParams.text,
            maxResults: 10,
            part: 'snippet'
        });

        request.execute(function(response) {
            this.parseYouTubeSongs(response.items);
            this.notifications.notify(models.events.SONGS_FOUND);
            deferred.resolve(response);
        }.bind(this), function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    },

    parseYouTubeSongs: function(songs){
        songs.forEach(function(song){
            this.foundSongs.push({
                type: "youtube",
                title: song.snippet.title,
                description: song.snippet.description,
                thumbnail: song.snippet.thumbnails.default.url,
                youtubeId: song.id.videoId,
                createdAt: song.snippet.publishedAt
            });
        }.bind(this));
    }

});


(function (){
    var SongModelProvider = Class.extend({
        instance: new SongModel(),

        $get: function($q, ParseService, Notifications){
            this.instance.$q = $q;
            this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
            return this.instance;
        }
    });

    angular.module('SongModel',[])
        .provider('SongModel', SongModelProvider);
}());
