//Global Service
angular.module('youtubeService', [])
    .factory('YoutubeService', function(){

        var YoutubeService = {
            search:function(query){
                var request = gapi.client.youtube.search.list({
                    q: query,
                    part: 'snippet'
                });

                return request.execute(function(response) {
                    //var str = JSON.stringify(response.result);
                    return response;
                });
            }
        };

        return YoutubeService;
    });
