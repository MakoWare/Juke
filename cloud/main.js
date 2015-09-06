var Hub  = Parse.Object.extend('Hub');
var Song = Parse.Object.extend('Song');
var QueuedSong = Parse.Object.extend('QueuedSong');

Parse.Cloud.define("addSongToPlaylist", function(request, response) {
    var song = JSON.parse(request.params.song);
    var hub  = new Hub(request.params.hub);




    var query = new Parse.Query("Song");
    query.equalTo("movie", request.params.movie);
    query.find({
        success: function(results) {
            var sum = 0;
            for (var i = 0; i < results.length; ++i) {
                sum += results[i].get("stars");
            }
            response.success(sum / results.length);
        },
        error: function() {
            response.error("movie lookup failed");
        }
    });
});
