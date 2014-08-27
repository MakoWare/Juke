'use strict';

//Player Controller
var PlayerCtrl = function($scope, $location, $http, ParseService ){
    //Get Hub by objectId
    $scope.getHubById = function(hubId){
	ParseService.getHubById(hubId, function(results){
	    $scope.$apply(function(){
		if(results != undefined){
		    $scope.hub = results;
		    $scope.getPlaylist();
		} else{
		    $location.path('/hubs');
		}
	    });
	});
    };

    //Get color
    $scope.getColor = function(index){
	var num = index % 5;
	var color = "success";
	switch (num){
	case 1:
	    color = "success";
	    break;
	case 2:
	    color = "info";
	    break;
	case 3:
	    color = "warning";
	    break;
	case 4:
	    color = "danger";
	    break;
	}
	return color;
    };

    //Vote
    $scope.vote = function(vote, queuedSong){
        if(vote == "up"){
            if($.inArray($scope.currentUser.id, queuedSong.get('ups')) > -1){
                return;
            } else {
                var promise = ParseService.vote($scope.currentUser.id, queuedSong.id, vote);
                promise.then(function(){
                    $scope.getPlaylist();
                });
            }
        } else {
            if($.inArray($scope.currentUser.id, queuedSong.get('downs')) > -1){
                return;
            } else {
                var promise = ParseService.vote($scope.currentUser.id, queuedSong.id, vote);
                promise.then(function(){
                    $scope.getPlaylist();
                });
            }
        }
    };

    //Get hub's playlist
    $scope.getPlaylist = function(){
	var promise = ParseService.getPlaylist($scope.hub.id, function(results){
	    $scope.$apply(function(){
		$scope.playlist = results;
	    });
	});
	return promise;
    };

    //Remove Song
    $scope.removeSong = function(){
	var promise = ParseService.removeSong($scope.playlist[0].id);
	return promise;
    };

    //Init Player
    $scope.initPlayer = function(){
        ParseService.getPlayer(function(result){
            $scope.player = result;
            $scope.player.addEventListener('onReady', onPlayerReady);
            $scope.player.addEventListener('onStateChange', onPlayerStateChange);
        });

	function onPlayerReady(event) {
	    $scope.loadNext();
	    event.target.playVideo();
	}

	function onPlayerStateChange(event) {
	    if(event.data == 0){
		var promise = $scope.removeSong();
		promise.then(function(){
		    $scope.loadNext();
		});
	    }
	}
    };

    //Load next Song
    $scope.loadNext = function(){
	var promise = $scope.getPlaylist();
	promise.then(function(results) {
	    if($scope.playlist.length > 0){
		var songId = $scope.playlist[0].get('song').get('pId');
		$scope.player.loadVideoById(songId);
	    }
	});
    };

    //Search for a youtube Video
    $scope.getVideos = function(){
	return $http.get("https://www.googleapis.com/youtube/v3/search", {
	    params: {
		part: "snippet",
		q: $scope.searchParam,
		type: "video",
		maxResults: 20,
		key: "AIzaSyBbe9WJQm4LmnZJ2HzgU8odGnItzXjdwDQ"
	    }
	}).then(function(res){
	    $scope.searchResults = res.data.items;
	});
    };

    //Add song from Youtube
    $scope.addSong = function(result){
	var song = {
            "type" : "yt",
            "title" : result.snippet.title,
            "description" : result.snippet.description,
            "thumbnail" : result.snippet.thumbnails.default.url,
            "pId" : result.id.videoId
        };
        ParseService.addSong($scope.currentUser.id, $scope.hub.id, song);
    };

    //init
    $scope.init = function(){
	$scope.currentUser = ParseService.getCurrentUser();
	if($scope.currentUser == undefined){
	    $location.path('#');
	}
	$scope.currentView = 'PlayList';
	$scope.playlist = {};
	$scope.getHubById($location.absUrl().split("/")[($location.absUrl().split("/").length) - 1]);

	$scope.searchResults = {};
	$scope.player = {};

	$scope.initPlayer();
    };

    //Init
    $scope.init();
}
