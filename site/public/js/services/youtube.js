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
            }
        };
        return YouTubeService;
    });
