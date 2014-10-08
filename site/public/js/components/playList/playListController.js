//Events

var PlayListCtrl = BaseController.extend({
    notifications: null,
    songsModel: null,

    init:function($scope, SongsModel, UsersModel, Notifications){
        console.log("PlayListCtrl.init()");
        this.notifications = Notifications;
        this.songsModel = SongsModel;
        this.usersModel = UsersModel;
        this._super($scope);
    },

    defineScope:function(){
	this.$scope.instance="PlayListCtrl";
        this.$scope.searchParam = "";
    },

    defineListeners:function(){
	this._super();
	this.notifications.addEventListener(juke.events.PLAYLIST_LOADED, this.handlePlayListLoaded.bind(this));
    },

    handlePlayListLoaded:function(event){
        var playlist = this.songsModel.playlist;
        var currentUser = this.usersModel.currentUser;
        this.$scope.playlist = playlist;

        if(currentUser){
            playlist.forEach(function(queuedSong){
                var ups = queuedSong.get('ups');
                var downs = queuedSong.get('downs');
                queuedSong.currentVote = null;
                ups.forEach(function(up){
                    if(up.id == currentUser.id){
                        queuedSong.currentVote = "up";
                    }
                });
                downs.forEach(function(down){
                    if(down.id == currentUser.id){
                        queuedSong.currentVote = "down";
                    }
                });
            });
        }
        this.$scope.$apply();
    },


    destroy:function(){

    }

});

PlayListCtrl.$inject = ['$scope', 'SongsModel', 'UsersModel', 'Notifications'];
