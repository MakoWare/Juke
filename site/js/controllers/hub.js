'use strict';

//Hub Controller
var HubCtrl = function($rootScope, $scope, $location, $modal, $log, $http, $q, $timeout, ParseService){

    //Get color for rows
    $scope.getColor = function(index){
        var num = index % 5;
        var color = "danger";
        switch(num){
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

    $scope.reverseGeoCode = function(hub){
        var geopoint = hub.get('location');
        if(geopoint){
            console.log(geopoint);
            var latlng = new google.maps.LatLng(geopoint.latitude, geopoint.longitude);
            var promise = $scope.geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        var address = results[1].formatted_address;
                        $scope.$apply(function(){
                            hub.address = address;
                        });

                    } else {
                        alert('No results found');
                    }
                } else {
                    alert('Geocoder failed due to: ' + status);
                }
            });
        }
    };

    //Get Hub by objectId
    $scope.getHubById = function(hubId){
	ParseService.getHubById(hubId, function(results){
	    $scope.$apply(function(){
		if(results != undefined){
		    $scope.hub = results;
		    $scope.getPlaylist();
		} else{
		    //$location.path('/hubs');
		}
	    });
	});
    };

    //Get hub's playlist
    $scope.getPlaylist = function(){
        console.log('getplaylist');
        var promise = ParseService.getPlaylist($scope.hub.id, function(results){
            $scope.$apply(function(){
                $scope.playlist = results;
            });
        });
        return promise;
    };

    //Get color
    $scope.getColor = function(index){
	var num= index% 5;
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

    //Get the current hub's users
    $scope.getUsersByHubId = function(hubId){
	ParseService.getUsersByHubId(hubId, function(results){
	    $scope.$apply(function(){
		$scope.hubUsers = results;
	    });
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

    //Did current User vote on a song?
    $scope.didVote = function(queuedSong, type){
	if($.inArray($scope.currentUser.id, queuedSong.get(type)) > -1){
	    return true;
	} else {
	    return false;
	}
    };

    //Get recently played songs
    $scope.getRecentlyPlayed = function(){
	if($scope.queuedSongs != undefined){
	    var inactive = [];
	    $scope.queuedSongs.forEach(function(song){
		if(song.get('active') == false){
		    inactive.push(song);
		}
	    });
	    return inactive;
	}
    };

    //Hub List View
    //Modal
    $scope.open = function(){
	$scope.hub = {};

	var modalInstance = $modal.open({
	    templateUrl: 'partials/createHubModal.html',
	    controller: ModalCtrl,
	    resolve: {
		hub: function(){
		    return $scope.hub;
		}
	    }
	});

	modalInstance.result.then(function (hub) {
	    $scope.hub = hub;
	    $scope.createHub();
	}, function () {

	});
    };

    //Get all Hubs
    $scope.getHubs = function(){
	ParseService.getHubs(function(results){
	    $scope.$apply(function(){
		$scope.hubs = results;
                $scope.hubs.forEach(function(hub){
                    $scope.reverseGeoCode(hub);
                });
	    });
	});
    };

    //Connect to Hub
    $scope.connectToHub = function(hub){
	if(hub.get('owner').id == $scope.currentUser.id){
	    $location.path('/player/' + hub.id);
	} else {
	    //auth
	    $location.path('/hubs/' + hub.id);
	}
    };

    //View User
    $scope.viewUser = function(userId){
	$location.path('/user/' + userId);
    };

    //Create Hub
    $scope.createHub = function(){
	ParseService.createHub($scope.hub, function(results){
	    $scope.$apply(function(){
		if(results != undefined){
		    $location.path('/player/' + results.id);
		}
	    });
	});
    };

    //Init
    $scope.init = function(){
	$scope.currentUser = ParseService.getCurrentUser();
	if($scope.currentUser == undefined){
	    $location.path('/');
	}

	if ($location.absUrl().split("/")[$location.absUrl().split("/").length - 1] == "hubs"){
            $scope.geocoder = new google.maps.Geocoder();
	    $scope.getHubs();
	} else {
	    $scope.currentView = "PlayList";
	    $scope.playlist = {};
	    $scope.recentlyPlayed = {};
	    var hubId = $location.absUrl().split("/")[$location.absUrl().split("/").length - 1];
	    $scope.getHubById(hubId);
	}
    };

    //Init
    $scope.init();
}
