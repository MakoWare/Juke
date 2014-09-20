//Events

var SongFinderCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, HubsModel, Notifications){
        console.log("SongFinderCtrl.init()");
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

SongFinderCtrl.$inject = ['$scope', 'HubsModel', 'Notifications'];
