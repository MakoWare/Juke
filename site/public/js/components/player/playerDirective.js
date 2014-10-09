namespace('juke.events').YOUTUBE_READY = "ActivityModel.YOUTUBE_READY";
namespace('juke.events').PLAYER_STATE_CHANGE = "ActivityModel.PLAYER_STATE_CHANGE";

var PlayerDirective = BaseDirective.extend({
    notifications:null,
    elm:null,

    init:function($scope,$elm,notifications){
	this.notifications = notifications;
	this.elm = $elm;
        this.songProgressTimer = null;
	this._super($scope);
        this.$scope.ytPlayerReady = false;
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this.mobile = true;
        } else {
            this.mobile = false;
        }


    },

    defineListeners:function(){
        var self = this;
        if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
            $.getScript('https://www.youtube.com/iframe_api');
        } else {
            self.createYoutubePlayer();
        }

        window.onPlayerReady = function(playerEvent){
            self.notifications.notify(juke.events.YOUTUBE_READY, playerEvent);
        };

        window.onPlayerStateChange = function(event){
            self.notifications.notify(juke.events.PLAYER_STATE_CHANGE, event);
        };

        window.onYouTubeIframeAPIReady = function() {
            console.log("youtubeIframeReady");
            self.createYoutubePlayer();
        };
        this.notifications.addEventListener(juke.events.PLAYER_STATE_CHANGE, this.handlePlayerStateChange.bind(this));
    },
    createYoutubePlayer:function(){
        if(!this.mobile){
            new YT.Player('player', {
                width: '140',
                height: '120',
                //            playerVars: { 'controls': 0, 'disablekb': 1, 'iv_load_policy': 3, 'showinfo': 0},
                playerVars: { 'controls': 1, 'disablekb': 1, 'iv_load_policy': 3, 'showinfo': 0},
                events: {
                    'onReady': window.onPlayerReady,
                    'onStateChange': window.onPlayerStateChange
                }
            });
        } else {
            new YT.Player('player', {
                width: '83',
                height: '70',
                //            playerVars: { 'controls': 0, 'disablekb': 1, 'iv_load_policy': 3, 'showinfo': 0},
                playerVars: { 'controls': 1, 'disablekb': 1, 'iv_load_policy': 3, 'showinfo': 0},
                events: {
                    'onReady': window.onPlayerReady,
                    'onStateChange': window.onPlayerStateChange
                }
            });
        }
    },


    //Show Song Progress
    showSongProgress:function(playerEvent){
        var playerElement = $('#playerWell')[0];
        if(!this.mobile){
            var col1= "rgba(255, 255, 255, .5)";
            var col2= "rgba(255, 255, 255, .1)";
        } else {
            var col1= "rgba(69, 130, 236, .5)";
            var col2= "rgba(255, 255, 255, 1)";
        }

        this.songProgressTimer = setInterval(function(){
            var p = playerEvent.target.getCurrentTime();
            var d = playerEvent.target.getDuration();
            var c = p/d*100;
            var percentage = c; // Math.round(c); //round to a whole number

            playerElement.style.background = "-webkit-gradient(linear, left top,right top, color-stop("+percentage+"%,"+col1+"), color-stop("+percentage+"%,"+col2+"))";
            playerElement.style.background = "-moz-linear-gradient(left center,"+col1+" "+percentage+"%, "+col2+" "+percentage+"%)";
            playerElement.style.background = "-o-linear-gradient(left,"+col1+" "+percentage+"%, "+col2+" "+percentage+"%)";
            playerElement.style.background = "linear-gradient(to right,"+col1+" "+percentage+"%, "+col2+" "+percentage+"%)";
        }, 500);
    },

    handlePlayerStateChange:function(event, playerEvent){
        if(playerEvent.data == 1){
            this.showSongProgress(playerEvent);
        }
        if(playerEvent.data == 2){
            if(this.songProgressTimer){
                clearInterval(this.songProgressTimer);
            }
        }
        if(playerEvent.data == 0){
            if(this.songProgressTimer){
                clearInterval(this.songProgressTimer);
            }
        }
    },

    destroy:function(event){

    }

});

angular.module('juke.player',[])
    .directive('player',['Notifications',function(Notifications){
        var partial;
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            partial = "partials/player/playerMobile.html";
        } else {
            partial = "partials/player/playerDesktop.html";
        }
        return {
	    restrict:'C',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new PlayerDirective($scope,$elm,Notifications);
	    },
	    scope:true,
            templateUrl: partial
	};
    }]);
