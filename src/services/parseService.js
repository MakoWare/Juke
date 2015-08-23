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
    }
});

(function(){
    var ParseServiceProvider = Class.extend({
        instance:new ParseService(),
        $get: function(){

            Parse.initialize("GU8DuOP6RzlnFFNBNOVnB5qrf6HCqxpJXSbDyN3W", "Wf6t36hyN7aPbkQzIxN6bXPMZGlr4xpdZgK1ljwG");

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
