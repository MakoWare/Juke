//Events

var PlayListCtrl = BaseController.extend({
    notifications: null,
    songsModel: null,

    init:function($scope, SongsModel, Notifications){
        console.log("PlayListCtrl.init()");
        this.notifications = Notifications;
        this.songsModel = SongsModel;
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
        console.log(this.songsModel.playlist);
        this.$scope.playlist = this.songsModel.playlist;
        this.$scope.$apply();
    },


    destroy:function(){

    }

});

PlayListCtrl.$inject = ['$scope', 'SongsModel', 'Notifications'];
