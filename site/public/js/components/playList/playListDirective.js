//Events
namespace('juke.events').VOTE_UP = "ActivityModel.VOTE_UP";
namespace('juke.events').VOTE_DOWN = "ActivityModel.VOTE_DOWN";

var PlayListDirective = BaseDirective.extend({

    notifications:null,
    elm:null,

    init:function($scope,$elm, SongsModel, UsersModel, notifications){
        console.log("PlayListDirective.init()");
	this.notifications = notifications;
	this.elm = $elm;
	this._super($scope);
        this.songsModel = SongsModel;
        this.usersModel = UsersModel;

    },

    defineListeners:function(){
        var self = this;
        $(window).resize(this.setTableHeight);
        this.$scope.upVote = function(song){
            if(self.usersModel.currentUser){

                if(song.currentVote == "down"){
                    song.set('score', (song.get('score') + 2));
                } else {
                    song.set('score', (song.get('score') + 1));
                }
                self.songsModel.vote(song, "up");
                song.currentVote = "up";
            } else {
                alert("You must be Signed In to vote");
            }
        };
        this.$scope.downVote = function(song){
            if(self.usersModel.currentUser){

                if(song.currentVote == "up"){
                    song.set('score', (song.get('score') - 2));
                } else {
                    song.set('score', (song.get('score') + 1));
                }
                self.songsModel.vote(song, "down");
                song.currentVote = "down";
            } else {
                alert("You must be Signed In to vote");
            }
        };

	this.notifications.addEventListener(juke.events.PLAYLIST_LOADED, this.handlePlayListLoaded.bind(this));
    },

    handlePlayListLoaded: function(){
        this.setTableHeight();
    },

    setTableHeight: function(){
        if($('#playListTable').is(':visible')){
            var space = window.innerHeight - $('#playListTable').offset().top;
            var tableHeight = space;
            $('#playListTable').height(tableHeight);
        }
    },

    destroy:function(event){

    }
});

angular.module('juke.playList',[])
    .directive('playList',['SongsModel', 'UsersModel',  'Notifications',function(SongsModel, UsersModel, Notifications){
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
		new PlayListDirective($scope,$elm, SongsModel, UsersModel, Notifications);
	    },
	    scope:true,
            templateUrl: partial
	};
    }]);
