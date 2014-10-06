var User = Parse.Object.extend("User");
var Hub = Parse.Object.extend("Hub");
var Song = Parse.Object.extend("Song");
var QueuedSong = Parse.Object.extend("QueuedSong");


//Get Hubs for Hubs Table
Parse.Cloud.define("getHubsForTable", function(request, response){
    var query = new Parse.Query(Hub);
    //query.limit(request.params.limit);
    //query.skip(request.params.skip);
    query.include("owner");
    query.find({
        succes: function(results){
            return results;
        },
        error: function(error){
            response.error(error);
        }
    }).then(function(results){
        var hubs = results;
        var promises = [];
        hubs.forEach(function(hub){
            var query = new Parse.Query(QueuedSong);
            query.equalTo("hub", hub);
            query.equalTo("position", 0);
            query.include("song");
            var promise = query.first({
                success: function(result){
                    hub.attributes.currentlyPlaying = result;
                    console.log("got currently playing");
                    console.log(hub);
                },
                error: function(error){
                    response.error(error);
                }
            });
            promises.push(promise);
        });

        Parse.Promise.when(promises).then(function(){
            response.success(hubs);
        });
    });
});

//Get PlayList
Parse.Cloud.define("getPlaylist", function(request, response) {
    var promise = getPlaylist(request.params.hubId);
    promise.then(function(results){
        response.success(results);
    });
});


var getPlaylist = function(hubId){
    var query = new Parse.Query(Hub);
    return query.get(hubId, {
        success: function(hub){
            return hub;
        },
        error: function(object, error){
            return error;
        }
    }).then(function(results){
        var hub = results;
        var QueuedSong = Parse.Object.extend("QueuedSong");
        var query = new Parse.Query(QueuedSong);
        query.limit(1000);
        query.include('song');
        query.include('hub');
        query.include('addedBy');
        query.equalTo('hub', hub);
        query.equalTo('active', true);
        query.ascending('updatedAt');
        return query.find({
            success: function(results){
                return results;
            },
            error: function(error){
                console.error(error.message);
                response.error("Error :" + error.message);
            }
        });
    }).then(function(results){
        if(results.length > 0){
            var currentlyPlaying = results[0];
            results.shift();
            if(results.length > 0){
                var hubDate = results[0].get('hub').createdAt.getTime();
                var songs = [];
                results.forEach(function(song){
                    var ups = song.get('ups').length;
                    var downs = song.get('downs').length;
                    var s = ups - downs;
                    var sign = 0;
                    var order = Math.log(Math.max(Math.abs(s) ,1));
                    if(s > 0){
                        sign = 1;
                    } else if(s < 0){
                        sign = -1;
                    } else {
                        sign = 0;
                    }

                    var seconds = (song.createdAt.getTime() ) - hubDate;
                    var position = s;
                    song.set('position', position);
                    song.set('score', s);
                });
                results.sort(compare);
                currentlyPlaying.set('position', 0);
                results.unshift(currentlyPlaying);
            } else {
                results.push(currentlyPlaying);
            }
            return Parse.Object.saveAll(results, {
                success: function(results){
                    return results;
                },
                error: function(error){
                    return error;
                }
            });
        } else {
            return results;
        }
    }).then(function(results){
        return results;
    });
};




//Recently Played
Parse.Cloud.define("getRecentlyPlayed", function(request, response) {
    var query = new Parse.Query(Hub);
    query.get(request.params.hubId, {
    success: function(hub){
        var QueuedSong = Parse.Object.extend("QueuedSong");
        var query = new Parse.Query(QueuedSong);
        query.limit(1000);
        query.include('song');
        query.include('hub');
        query.equalTo('hub', hub);
        query.equalTo('active', false);
        query.find({
        success: function(results){
            if(results.length > 0){
            response.success(results);
            }
        },
        error: function(error){
            console.error(error.message);
            response.error("Error :" + error.message);
        }
        });
    },
    error: function(object, error){
        response.error("Error :" + error.message);
    }
    });
});


//Remove Song
Parse.Cloud.define("removeSong", function(request, response) {
    var queuedSongId = request.params.queuedSongId;
    var QueuedSong = Parse.Object.extend("QueuedSong");
    var query = new Parse.Query(QueuedSong);
    query.get(queuedSongId, {
    success: function(queuedSong){
        queuedSong.set('active', false);
        queuedSong.save();
        response.success();
    },
    error: function(object, error){
        response.error(error);
    }
    });
});

//Vote
//Parse.Cloud.define("vote", function(request, response) {
//    var userId = request.params.userId;
//    var queuedSongId = request.params.queuedSongId;
//    var vote = request.params.vote;
//
//
//    var query = new Parse.Query(QueuedSong);
//    query.get(queuedSongId, {
//        success: function(queuedSong){
//            if(vote == "up"){
//                queuedSong.addUnique("ups", userId);
//                queuedSong.remove("downs", userId);
//            } else {
//                queuedSong.addUnique("downs", userId);
//                queuedSong.remove("ups", userId);
//            }
//            queuedSong.save();
//            response.success();
//        },
//        error: function(object, error){
//            response.error(error);
//        }
//    });
//});

/** The function to vote up

params:
 - direction : (String) the direction in which to vote
 - queuedSongId : (String) the ID for the QueuedSong being voted upon

*/
Parse.Cloud.define("vote", function(request, response) {
//    vote("up",request.params.userId,request.params.queuedSongId);
    var direction = request.params.direction ? request.params.direction : request.params.vote;
    var queuedSongId = request.params.queuedSongId;
    
    var queuedSongQuery = new Parse.Query(QueuedSong);
    queuedSongQuery.get(queuedSongId).then(function(queuedSong){
        if(direction=="up"){
            queuedSong.addUnique("ups", Parse.User.current());
            queuedSong.remove("downs", Parse.User.current());
        } else if(direction=="down"){
            queuedSong.addUnique("downs", Parse.User.current());
            queuedSong.remove("ups", Parse.User.current());
        } else {
            // return error for bad vote direction
            response.error("Wrong voting direction: "+direction);
        }
        queuedSong.save().then(function(obj){
            response.success(queuedSong);
        }, function(err){
            response.error("Failed to save the QueuedSong with id: "+queuedSongId);
        });
    }, function(err){
        response.error("Failed to find the QueuedSong with id: "+queuedSongId);
    });
});

//comparator for queuedSong.position
function compare(a,b) {
    if (a.get('position') < b.get('position'))
    return 1;
    if (a.get('position') > b.get('position'))
    return -1;
    return 0;
}


//Create Hub
//request params - title (string), range (number), private(boolean), password(string), location(GeoPoint), user(User), type(string)
Parse.Cloud.define("createHub", function(request, response) {
    //First check if user is allowed to create a hub
    var user = request.params.user;
    var query = new Parse.Query(Hub);
    query.equalTo('owner', user);
    query.first({
    success: function(results){
        //If user does not have a hub
        if(results == undefined){
        var hub = new Hub();
        hub.set('title',    request.params.title);
        hub.set('range',    request.params.range);
        hub.set('private',  request.params.private);
        hub.set('password', request.params.password);
        hub.set('location', request.params.location);
        hub.set('type', request.params.type);
        hub.set('owner',    request.params.owner);
        hub.save({
            success: function(results){
            response.success(results);
            },
            error: function(object, error){
            response.error(error);
            }
        });
        } else {
        response.error("already has hub");
        }
    },
    error: function(error){
        response.error(error);
    }
    });
});

//Add Song to Queue
//request params - user(User), hub (Hub), song(Song)
Parse.Cloud.define("addSong", function(request, response) {
    var hubId =  request.params.hubId;
    var userId = request.params.userId;
    var submittedSong = request.params.song;
    var hub = {};
    var user = {};

    //First get the hub and the user
    var hubQuery = new Parse.Query(Hub);
    var hubPromise = hubQuery.get(hubId, {
        success: function(result){
            hub = result;
        },
        error: function(error){
            response.error(error);
        }
    });

    var userQuery = new Parse.Query(User);
    var userPromise = userQuery.get(userId, {
        success: function(result){
            user = result;
        },
        error: function(error){
            response.error(error);
        }
    });

    var promises = [userPromise, hubPromise];
    Parse.Promise.when(promises).then(function(results){
        //First Check if User is allowed to add a song
        if(addCheck(hub, user, song)){
            var song = new Song();
            song.set('artist',submittedSong.artist);
            song.set('title',submittedSong.title);
            song.set('description',submittedSong.description);
            song.set('thumbnail',submittedSong.thumbnail);
            song.set('type',submittedSong.type);
            song.set('pId',submittedSong.pId);
            song.set('url',submittedSong.url);
            song.set('owner', user);
            song.set('hub', hub);
            song.save({
                success: function(song){
                var queuedSong = new QueuedSong();
                queuedSong.set('hub', hub);
                queuedSong.set('song', song);
                queuedSong.set('addedBy', user);
                queuedSong.set('score', 1);
                queuedSong.set('ups', [user.id]);
                queuedSong.set('downs', []);
                queuedSong.set('active', true);

                queuedSong.save({
                    success: function(result){
                            response.success();
                    },
                    error: function(object, error){
                            response.error(error);
                    }
                });
                },
                error: function(object, error){
                    response.error(error);
                }
            });
        }
    });
});

//Add YouTubeSong to Queue
//request params - user.id, hub.id, YouTubeSong (actual result from api request)
Parse.Cloud.define("addYouTubeSong", function(request, response) {
    var hubId =  request.params.hubId;
    var userId = request.params.userId;
    var submittedSong = request.params.song;
    var hub = {};
    var user = {};

    //First get the hub and the user
    var hubQuery = new Parse.Query(Hub);
    var hubPromise = hubQuery.get(hubId, {
        success: function(result){
            hub = result;
        },
        error: function(error){
            response.error(error);
        }
    });

    var userQuery = new Parse.Query(User);
    var userPromise = userQuery.get(userId, {
        success: function(result){
            user = result;
        },
        error: function(error){
            response.error(error);
        }
    });

    var promises = [userPromise, hubPromise];
    Parse.Promise.when(promises).then(function(results){
        //First Check if User is allowed to add a song
        if(addCheck(hub, user, song)){
            var song = new Song();
            song.set('title',submittedSong.snippet.title);
            song.set('description',submittedSong.snippet.description);
            song.set('thumbnail',submittedSong.snippet.thumbnails.default.url);
            song.set('type', "youtube");
            song.set('pId', submittedSong.id.videoId);
            song.set('owner', user);
            song.save({
                success: function(song){
                var queuedSong = new QueuedSong();
                queuedSong.set('hub', hub);
                queuedSong.set('song', song);
                queuedSong.set('addedBy', user);
                queuedSong.set('score', 1);
                queuedSong.set('ups', [user.id]);
                queuedSong.set('downs', []);
                queuedSong.set('active', true);
                queuedSong.save({
                    success: function(result){
                        getPlaylist(hub.id).then(function(results){
                            response.success(results);
                        });
                    },
                    error: function(object, error){
                        response.error(error);
                    }
                });
                },
                error: function(object, error){
                    response.error(error);
                }
            });
        }
    });
});

var addCheck = function(hub, user, song){
    var valid = true;
    return valid;
};


/**
 *
 *  stuff for the iPhone app
 *
 *
 */
//Parse.Cloud.afterDelete("Hub", function(request) {
//    var Song = Parse.Object.extend("Song");
//    var query = new Parse.Query(Song);
//    query.equalTo("hub", request.object);
//    query.find({
//        success: function(songs) {
////            console.log("i found the songs for " + request.object.id);
//            Parse.Object.destroyAll(songs, {
//                success: function() {
////                    console.log("i deleted shit");
//                },
//                error: function(error) {
//                    console.error("Error deleting related comments " + error.code + ": " + error.message);
//                }
//            });
//
//        },
//        error: function(error) {
//            console.error("Error finding related comments " + error.code + ": " + error.message);
//        }
//    });
//});

Parse.Cloud.define("ytUrl", function(req, res) {
    var makoUrl = "http://makowaredev.com:3113/ytdl?id="+req.params.id;
    Parse.Cloud.httpRequest({
        method:'GET',
        url:makoUrl
    }).then(function(result){
        var obj = result.data;
        if(obj.status === 'OK'){
            res.success({'url': obj.url});
        } else {
            res.error({'err':'makoware call failed', 'data':result.data});
        }
    });
});


/**
 *
 *  youtube url parser
 *
 * https://www.youtube.com/get_video_info?&video_id=_ovdm2yX4MA&el=detailpage&ps=default&eurl=&gl=US&hl=en
 */
var yt2 = function(req, res){

    // pull the parsev4 file
    Parse.Cloud.httpRequest({
        method: 'GET',
        url:'http://www.feelthemusi.com/parsev4'
    }).then(function(data){
        var file = data.text;

        Parse.Cloud.httpRequest({
            method: 'GET',
            //        url:'https://www.youtube.com/get_video_info',
            url:'https://www.youtube.com/watch',
            params:{
                v:req.params.id
            }
        }).then(function(obj){
            var page = obj.text;

            res.success({'file':file,'page':page});
        },function(err){
            res.error({'err':'failed to get youtube page'});
        });

    },function(err){
        res.error({'err':'failed to get parsev4'});
    });
};

Parse.Cloud.define("yt", yt2);



/**
 *
 *  Future oauth token swap stuff
 *
 *
 */

var kClientId = "spotify-ios-sdk-beta";
var kClientSecret = "ba95c775e4b39b8d60b27bcfced57ba473c10046";
var kClientCallbackURL = "spotify-ios-sdk-beta://callback";

var _ = require('underscore');
var express = require('express');
var app = express();

// Global app configuration section
app.use(express.bodyParser());  // Populate req.body

/**
 * This function is called when GitHub redirects the user back after
 *   authorization.  It calls back to GitHub to validate and exchange the code
 *   for an access token.
 */
var getSpotifyAccessToken = function(code) {

    var json = {
        grant_type      :   'authorization_code' ,
        client_id       :   kClientId,
        client_secret   :   kClientSecret,
        redirect_uri    :   kClientCallbackURL,
        code            :   code
    };
    return Parse.Cloud.httpRequest({
        method: 'POST',
        url: "https://ws.spotify.com/oauth/token",
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Parse.com Cloud Code'
        },
        body: json
    });
};

app.post('/swap',function(req,res){
//    res.send(reg.params);
    console.log('post to /swap');
    console.log(req.body.code);

    var response = getSpotifyAccessToken(req.body.code);

    response.then(function(obj){
//        console.log(obj);
        res.send(obj.data);
    });


});

app.listen();
