//Events

var SongFinderController = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, HubsModel, Notifications){
        console.log("SongFinderController.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this._super($scope);
    },

    defineScope:function(){
	this.$scope.instance="SongFinderController";
    },

    defineListeners:function(){
	this._super();
    },

    destroy:function(){

    }

});

SongFinderController.$inject = ['$scope', 'HubsModel', 'Notifications'];
