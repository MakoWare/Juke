//Events
namespace('juke.events').SONGS_SEARCH = "ActivityModel.SONGS_SEARCH";

var SongFinderDirective = BaseDirective.extend({

    notifications:null,
    elm:null,

    init:function($scope,$elm,notifications){
        console.log("SongFinderDirective.init()");
	this.notifications = notifications;
	this.elm = $elm;
	this._super($scope);
    },

    defineListeners:function(){
        // After the API loads, call a function to enable the search button.
        function handleAPILoaded() {
            $('#findSongsButton').attr('disabled', false);
            console.log("API loaded?");
        }

        $('#findSongsButton').click(this.findSongs.bind(this));

    },

    findSongs:function(){
        var query = $('#songSearchQuery').val();
        //For now Just pass query, easy to extend params for Service type, i.e, spotify
        this.notifications.notify(juke.events.SONGS_SEARCH, query);
    },

    destroy:function(event){

    }
});

angular.module('juke.songFinder',[])
    .directive('songFinder',['Notifications',function(Notifications){
        console.log("songFinder");
        return {
	    restrict:'C',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new SongFinderDirective($scope,$elm,Notifications);
	    },
	    scope:true,
            templateUrl: "partials/songFinder.html"
	};
    }]);
