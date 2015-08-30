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

    findSongs: function(){

    },

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
