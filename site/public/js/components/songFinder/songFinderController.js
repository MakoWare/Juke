//Events

var SongFinderCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, SongsModel, Notifications){
        console.log("SongFinderCtrl.init()");
        this.notifications = Notifications;
        this.songsModel = SongsModel;
        this._super($scope);
    },

    defineScope:function(){
	this.$scope.instance="SongFinderController";
    },

    defineListeners:function(){
	this._super();

	this.notifications.addEventListener(juke.events.SONGS_SEARCH, this.handleSongsSearch.bind(this));
	this.notifications.addEventListener(juke.events.SONGS_FOUND, this.handleSongsFound.bind(this));

    },

    handleSongsSearch:function(event, query){
        //Just search YouTube for now, this is easily extendable
        this.songsModel.findYoutubeSongs(query);
    },

    handleSongsFound:function(){

    },

    destroy:function(){

    }

});

SongFinderCtrl.$inject = ['$scope', 'SongsModel', 'Notifications'];
