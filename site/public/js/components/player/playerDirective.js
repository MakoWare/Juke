var PlayerDirective = BaseDirective.extend({

    notifications:null,
    elm:null,

    init:function($scope,$elm,notifications){
        console.log("PlayerDirective.init()");
	this.notifications = notifications;
	this.elm = $elm;
	this._super($scope);
        this.songProgressTimer = null;
    },

    defineListeners:function(){
        this.notifications.addEventListener(juke.events.PLAYER_STATE_CHANGE, this.handlePlayerStateChange.bind(this));
    },

    //Show Song Progress
    showSongProgress:function(playerEvent){
        var playerElement = $('#playerWell')[0];
        var col1= "rgba(255, 255, 255, .5)";
        var col2= "rgba(255, 255, 255, .1)";
        console.log(playerEvent);


        this.songProgressTimer = setInterval(function(){
            var p = playerEvent.target.getCurrentTime(); //get video position
            var d = playerEvent.target.getDuration(); //get video duration
            var c = p/d*100; //calculate % complete
            var percentage = c; // Math.round(c); //round to a whole number
            console.log("p:" + p);
            console.log("d:" + d);
            console.log("c:" + c);
            console.log(percentage);

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
