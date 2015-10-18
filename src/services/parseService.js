'use strict';

var ParseService = Class.extend({

    Hub: Parse.Object.extend("Hub"),
    Song: Parse.Object.extend("Song"),
    QueuedSong: Parse.Object.extend("QueuedSong"),
    HubACL: new Parse.ACL(),
    SongACL: new Parse.ACL(),
    QueuedSongACL: new Parse.ACL(),

    /**** util ****/
    genRandomPass:function(){
        var string = 'password';
        for(var i=0;i<10;i++){
            string = string+(Math.floor(Math.random() * 9) + 1).toString();
        }
        return string;
    },

    /**** Users ****/
    login: function(username, password){
        return Parse.User.logIn(username, password, {
            success: function(user) {
                return user;
            },
            error: function(user, error) {
                console.log(error);
                return error;
            }
        });
    },

    signOut: function(){
        return Parse.User.logOut();
    },

    signUp: function(username, password){
        return Parse.User.signUp(username, password, {
            success: function(user) {
                return user;
            },
            error: function(user, error) {
                console.log(error);
                return error;
            }
        });
    },

    //CREATE
    createUser: function(user){
        return Parse.Cloud.run('createUser',user);
    },

    //UPDATE
    updateUser: function(user){

    },

    //READ
    getCurrentUser: function(){
        return Parse.User.current();
    },

    //READ
    getUsers: function(){
        var query = new Parse.Query(Parse.User);
        return query.find();
    },

    //READ
    getUserById: function(id){
        var query = new Parse.Query("User");
        query.include('currentGym');
        return query.get(id);
    },

    //DELETE
    deletUser: function(userId){
        return Parse.Cloud.run('deleteUser', userId);
    },

    /** Hubs **/

    //CREATE
    createHub: function(hub){
        var newHub = new this.Hub();
        newHub.set("name", hub.name);
        newHub.set("password", hub.password);
        newHub.set("type", "web");
        newHub.set("owner", Parse.User.current());
        return newHub.save(null, {
            success: function(newHub){
                return newHub;
            }, error: function(newHub, error){
                return error;
            }
        });
    },

    //UPDATE
    updateHub: function(){

    },

    //READ
    getHubs: function(){
        var query = new Parse.Query("Hub");
        query.include("owner");
        return query.find({
            success: function(hubs){
                return hubs;
            }, error: function(error){
                return error;
            }
        });
    },

    //READ
    getHubById: function(id){
        var query = new Parse.Query("Hub");
        query.include("owner");
        return query.get(id, {
            success: function(hub){
                return hub;
            }, error: function(hub, error){
                return error;
            }
        });
    },

    //DELETE
    deleteHub: function(hubId){
        return Parse.Cloud.run('deleteHub', {hubId: hubId, userId: Parse.User.current().id});
    },

    /** SONGS **/

    //Add Song
    addSongToPlaylist: function(song, hub){
        var deferred = this.$q.defer();
        var queuedSong = new this.QueuedSong();
        queuedSong.set("addedBy", Parse.User.current());
        queuedSong.set("hub", hub);
        queuedSong.set("title", song.title);
        queuedSong.set("thumbnail", song.thumbnail);
        queuedSong.set("description", song.description);
        queuedSong.set("type", song.type);
        queuedSong.set("youtubeId", song.youtubeId);
        queuedSong.set("songCreatedAt", song.createdAt);

        queuedSong.save(null, {
            success: function(result){
                deferred.resolve(result);
            }, error: function(error){
                deferred.reject(error);
            }
        });

        return deferred.promise;

        //For Song analytics
        /*
        var query = new Parse.Query("Song");
        if(song.type == 'youtube'){
            query.equalTo("type", "youtube");
            query.equalTo("youtubeId", song.youtubeId);
        } else {
            console.log("error, don't know type of song");
        }

        query.first({
            success: function(result){
                if(result.id){
                    result.set("playCount", result.get("addCount") + 1);
                } else {
                    //create new Song
                }
            }, error: function(error){
                deferred.reject(error);
            }
        });
         */


        //Needs to be in the cloud eventually
        //return Parse.Cloud.run('addSongToPlaylist', {song: JSON.stringify(song), hub: hub.toJSON(), userId: Parse.User.current().id });
    }

});

(function(){
    var ParseServiceProvider = Class.extend({
        instance:new ParseService(),
        $get: function($q){

            Parse.initialize("GU8DuOP6RzlnFFNBNOVnB5qrf6HCqxpJXSbDyN3W", "Wf6t36hyN7aPbkQzIxN6bXPMZGlr4xpdZgK1ljwG");
            this.instance.$q = $q;
            this.instance.HubACL.setPublicReadAccess(true);
            this.instance.HubACL.setPublicWriteAccess(false);
            this.instance.SongACL.setPublicReadAccess(true);
            this.instance.SongACL.setPublicWriteAccess(false);
            this.instance.QueuedSongACL.setPublicReadAccess(true);
            this.instance.QueuedSongACL.setPublicWriteAccess(false);

            return this.instance;
        }
    });

    angular.module('ParseService',[])
        .provider('ParseService', ParseServiceProvider);
})();
