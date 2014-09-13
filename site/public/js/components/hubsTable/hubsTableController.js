//Events
namespace('juke.events').CREATE_HUB_INTENT = "ActivityModel.CREATE_HUB_INTENT";


var HubsTableCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, HubsModel, Notifications){
        console.log("HubsTableCtrl.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this._super($scope);
        this.hubsModel.getHubsForTable();
    },

    defineScope:function(){
	this.$scope.instance="HubsTableController";
        this.$scope.createHub = this.createHub;
    },

    defineListeners:function(){
	this._super();
	this.notifications.addEventListener(juke.events.HUBS_LOADED, this.handleNewHubs.bind(this));
    },

    destroy:function(){
	this.notifications.removeEventListener(juke.events.HUBS_LOADED, this.handleNewHubs.bind(this));
    },

    //Handle HubsModel getting new Hubs
    handleNewHubs:function(event){
        console.log("So I hear you got new Hubs:");
        console.log(this.hubsModel.hubs);
        this.$scope.hubs = this.hubsModel.hubs;
        this.$scope.$apply();

    },

    //Handle User Clicking Create Hub Button
    createHub:function(){
        console.log("create new hub");
        this.notifications.notify(juke.events.CREATE_HUB_INTENT);
    }
});

HubsTableCtrl.$inject = ['$scope','HubsModel', 'Notifications'];
