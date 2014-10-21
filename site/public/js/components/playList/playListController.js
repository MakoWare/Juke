//Events

var PlayListCtrl = BaseController.extend({
    notifications: null,
    songsModel: null,

    init:function($scope, SongsModel, UsersModel, Notifications){
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
	this.notifications.addEventListener(juke.events.SEARCH_CHANGED, this.handleSearchChanged.bind(this));
	this.notifications.addEventListener(juke.events.USER_LOGGED_IN, this.handleUserLogin.bind(this));
	this.notifications.addEventListener(juke.events.USER_LOGGED_OUT, this.handleUserLogout.bind(this));
    },

    handlePlayListLoaded:function(event){
        var playlist = this.songsModel.playlist;
        var currentUser = this.usersModel.currentUser;
        this.$scope.playlist = playlist;
        if(currentUser){
            this.markThumbs();
        }
        this.$scope.$apply();
    },

    handleSearchChanged:function(event, query){
        if($('#playListTable').is(':visible')){
            this.$scope.searchParam = query;
            this.$scope.$apply();
        }
    },

    handleUserLogin:function(event){
        this.markThumbs();
    },

    handleUserLogout:function(event){
        this.unMarkThumbs();
    },


    markThumbs:function(){
        var currentUser = this.usersModel.currentUser;
        var playlist = this.$scope.playlist;

        if(currentUser && playlist){
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

    unMarkThumbs:function(){
        var playlist = this.$scope.playlist;

        if(playlist){
            playlist.forEach(function(queuedSong){
                queuedSong.currentVote = "";
            });
        }
        this.$scope.$apply();
    },


    destroy:function(){

    }

});

PlayListCtrl.$inject = ['$scope', 'SongsModel', 'UsersModel', 'Notifications'];
