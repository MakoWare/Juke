//Events
namespace('juke.events').VOTE_UP = "ActivityModel.VOTE_UP";
namespace('juke.events').VOTE_DOWN = "ActivityModel.VOTE_DOWN";

var PlayListDirective = BaseDirective.extend({

    notifications:null,
    elm:null,

    init:function($scope,$elm, SongsModel, notifications){
        console.log("SongFinderDirective.init()");
	this.notifications = notifications;
	this.elm = $elm;
	this._super($scope);
        this.songsModel = SongsModel;

        //Init Table Height
        this.setTableHeight();
    },

    defineListeners:function(){
        var self = this;
        $(window).resize(this.setTableHeight);
        this.$scope.upVote = function(song){
            self.songsModel.upVote(song);
            song.currentVote = "up";
        };
        this.$scope.downVote = function(song){
            self.songsModel.downVote(song);
            song.currentVote = "down";
        };
    },

    setTableHeight: function(){
        if($('#playListTable').is(':visible')){
            var space = window.innerHeight - $('#playListTable').offset().top;
            var tableHeight = (space * .7);
            $('#playListTable').height(tableHeight);
        }
    },

    findSongs:function(){
        var query = $('#songSearchQuery').val();
        //For now Just pass query, easy to extend params for Service type, i.e, spotify
        this.notifications.notify(juke.events.SONGS_SEARCH, query);
    },

    destroy:function(event){

    }
});

angular.module('juke.playList',[])
    .directive('playList',['SongsModel', 'Notifications',function(SongsModel, Notifications){
        var partial;
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            partial = "partials/playList/playListMobile.html";
        } else {
            partial = "partials/playList/playListDesktop.html";
        }

        return {
	    restrict:'C',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new PlayListDirective($scope,$elm, SongsModel, Notifications);
	    },
	    scope:true,
            templateUrl: partial
	};
    }]);
