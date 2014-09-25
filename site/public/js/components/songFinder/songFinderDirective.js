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
        // After the API loads, call a function to enable the search box.
        function handleAPILoaded() {
            $('#search-button').attr('disabled', false);
        }

        // Search for a specified string.
        function search() {
            var q = $('#query').val();
            var request = gapi.client.youtube.search.list({
                q: q,
                part: 'snippet'
            });

            request.execute(function(response) {
                var str = JSON.stringify(response.result);
                $('#search-container').html('<pre>' + str + '</pre>');
            });
        }


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
