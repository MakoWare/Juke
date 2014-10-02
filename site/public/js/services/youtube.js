//YouTube Service
angular.module('youtubeService', [])
    .factory('YouTubeService', function(){

        var loaded = false;
        var player;

        var YouTubeService = {
            search:function(query, callback){
                var request = gapi.client.youtube.search.list({
                    q: query,
                    maxResults: 50,
                    part: 'snippet'
                });

                request.execute(function(response) {
                    callback(response);
                });
            },

            getPlayer: function getPlayer(callback){
                if(loaded){
                    var player = new YT.Player('player', {
                        videoId: '0gl8UKAYI7k'
                    });
                    callback(player);
                } else {
                    window.onYouTubeIframeAPIReady = function() {
                        console.log("ready!!!");
                        loaded = true;
                        var player = new YT.Player('player', {
                            videoId: '0gl8UKAYI7k',
                            controls: "1"
                        });
                        callback(player);
                    };
                };
            }

        };
        return YouTubeService;
    });
