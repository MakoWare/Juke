'use strict';
namespace('models.events').PLAY = "ActivityModel.PLAY";
namespace('models.events').STOP = "ActivityModel.STOP";
namespace('models.events').NEXT_SONG = "ActivityModel.NEXT_SONG";
namespace('models.events').SONGS_LOADED = "ActivityModel.SONGS_LOADED";

var YouTubePlayerDirective = BaseDirective.extend({
    notifications: null,
    hubModel: null,
    player: null,
    state: null,


    init: function($scope, $rootScope, Notifications){
        this.$rootScope = $rootScope;
        this.notifications = Notifications;
        this._super($scope);
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
        this.initYouTubePlayer();
    },

    destroy: function(){
        this._super();
    },

    initYouTubePlayer: function(){
        this.player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: 'M7lc1UVf-VE',
            events: {
                'onReady': this.onPlayerReady,
                'onStateChange': this.onPlayerStateChange.bind(this)
            }
        });
    },

    onPlayerReady: function(event){
        event.target.playVideo();
    },

    onPlayerStateChange: function(event){
        this.player.stopVideo();
    }

});

angular.module('youtubePlayer',[])
    .directive('youtubePlayer', function($rootScope, Notifications){
	return {
	    restrict:'E',
	    link: function($scope){
		new YouTubePlayerDirective($scope, $rootScope, Notifications);
	    },
	    scope:false,
            templateUrl: "partials/player/modules/youtubePlayer.html"
	};
    });
