//Parse Service
angular.module('parseService', [])
    .factory('ParseService', function(){

	//Init Parse
	Parse.initialize("GU8DuOP6RzlnFFNBNOVnB5qrf6HCqxpJXSbDyN3W", "Wf6t36hyN7aPbkQzIxN6bXPMZGlr4xpdZgK1ljwG");

	//Define Parse Objects
	var Hub = Parse.Object.extend("Hub");
	var QueuedSong = Parse.Object.extend("QueuedSong");
	var Song = Parse.Object.extend("Song");


        var ParseService = {
	    name: "Parse",

            getPlayer: function(callback){
                if(loaded){
                    var player = new YT.Player('player', {
                        videoId: '0gl8UKAYI7k'
                    });
                    callback(player);
                } else {
                    window.onYouTubeIframeAPIReady = function() {
                        loaded = true;
                        var player = new YT.Player('player', {
                            videoId: '0gl8UKAYI7k'
                        });
                        callback(player);
                    };
                };
            },

	    //User
	    //Login
	    login: function(username, password) {
		return Parse.User.logIn(username, password, {
		    success: function(user) {
                        return user;
		    },
		    error: function(error) {
                        alert("Error: " + error.message);
		    }
		});
	    },

	    //Logout
	    logout: function(){
		Parse.User.logOut();
	    },

	    //Sign up
	    signUp: function(username, password) {
		var acl = new Parse.ACL();
		acl.setPublicReadAccess(true);
		return Parse.User.signUp(username, password, { ACL: acl }, {
		    success: function(user) {
                        return user;
		    },
		    error: function(user, error) {
			alert("Error: " + error.message);
		    }
		});
	    },

            //Reset Password
	    resetPassword: function(email) {
                Parse.User.requestPasswordReset(email, {
                    success: function() {
                        alert("An email was sent to you");
                    },
                    error: function(error) {
                        alert("Error: " + error.message);
                    }
                });
	    },

            //Get current User
            getCurrentUser: function(){
                return Parse.User.current();
            },


	    //Hubs
	    //Get a Hub by its objectId
	    getHubById : function getHubById(hubId){
		var query = new Parse.Query(Hub);
		return query.get(hubId, {
		    success: function(result){
                        return result;
		    },
		    error: function(error){
			return error;
		    }
		});
	    },

	    //Get All Hubs
	    getHubs : function(){
		var query = new Parse.Query(Hub);
		query.include('owner');
                query.limit(1000);
		var promise = query.find({
		    success: function(hubs){
			return(hubs);
		    },
		    error: function(object, error){
			alert("Error: " + error.message);
		    }
		});
                return promise;
	    },

	    //Get Hubs for the Hubs Table
	    getHubsForTable : function(){
                return Parse.Cloud.run('getHubsForTable', {}, {
		    success: function(results){
                        return results;
		    },
		    error: function(error){
                        return error;
		    }
		});
	    },

	    //Create Hub
	    createHub : function(name, password, capabilities){
		var currentUser = Parse.User.current();
		var hub = new Hub();
		hub.set("title", name);
                hub.set("passcode", password);
                hub.set("capabilities", capabilities);
                hub.set("owner", currentUser);
                hub.set("allowedUsers", [currentUser]);
                hub.set("blockedUsers", []);
                hub.set("type", "web");
		return hub.save({
		    success: function(result){
			return(hub);
		    },
		    error: function(error){
			return error;
		    }
		});
	    },

	    //get a hub's queuedSongs
	    getUsersByHubId : function getUsersByHubId(id, callback){
		var query = new Parse.Query(User);
		query.equalTo('currentHub', hubId);
		query.include('owner');
		query.find({
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error: " + error.message);
		    }
		});
	    },

	    //add a song to the current Hub
	    addSong : function(hub, song, type){
                if(type == "YouTube"){
                    ParseService.addYouTubeSong(hub, song);
                }
	    },

            //Add a song from YouTube
            addYouTubeSong:function(hub, song){
                var hubId = hub.id;
                var userId = Parse.User.current().id;

		return Parse.Cloud.run('addYouTubeSong', {'userId' : userId, 'hubId' : hubId, 'song' : song}, {
		    success: function(result){
                        alert("Song successfully added");
		    },
		    error: function(error){
                        alert("Error: " + error.message);
		    }
		});
            },


	    //Remove a song from the current playlist
	    removeSong : function removeSong(queuedSongId){
		return Parse.Cloud.run('removeSong', {'queuedSongId' : queuedSongId}, {
		    success: function(){

		    },
		    error: function(error){
			alert("Error: " + error.message);
		    }
		});
	    },

	    //Vote on a Song
	    vote : function vote(userId, queuedSongId, vote){
		return Parse.Cloud.run('vote', {'vote' : vote, 'userId' : userId, 'queuedSongId' : queuedSongId},{
		    success: function(){

		    },
		    error: function(error){
			alert("Error: " + error.message);
		    }
		});
	    },


	    //Get the Current Playlist
	    getPlaylist : function getPlaylist(hubId){
		return	Parse.Cloud.run('getPlaylist', {'hubId' : hubId}, {
		    success: function(results){
			return results;
		    },
		    error: function(error){
			alert("Error: " + error.message);
		    }
		});
	    },

	    //Get Recently Played Songs
	    getRecentlyPlayed : function getRecentlyPlayed(hubId, callback){
		Parse.Cloud.run('getRecentlyPlayed', {'hubId' : hubId}, {
		    success: function(results){
			callback(results);
		    },
		    error: function(error){
			alert("Error: " + error.message);
		    }
		});
	    },

            //Checks if User is on mobile
            isMobile : function(){
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    return true;
                } else {
                    return false;
                }
            }
	};
	return ParseService;
    });
