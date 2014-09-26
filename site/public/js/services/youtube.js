//YouTube Service
angular.module('youtubeService', [])
    .factory('YouTubeService', function(){


        var YouTubeService = {
            search:function(query, callback){
                var request = gapi.client.youtube.search.list({
                    q: query,
                    part: 'snippet'
                });

                request.execute(function(response) {
                    //var str = JSON.stringify(response.result);
                    callback(response);
                });
            }
        };

        return YouTubeService;
    });
