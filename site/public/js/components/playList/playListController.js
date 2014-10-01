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
        this.$scope.foundSongs = [];
    },

    defineListeners:function(){
	this._super();
	//this.notifications.addEventListener(juke.events.VOTE_UP, this.handle.bind(this));
    },

    handleSongsSearch:function(event, query){
        //Just search YouTube for now, this is easily extendable
        this.songsModel.findYoutubeSongs(query);
    },


    destroy:function(){

    }

});

PlayListCtrl.$inject = ['$scope', 'SongsModel', 'Notifications'];
