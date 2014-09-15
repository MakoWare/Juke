//Events
namespace('juke.events').CREATE_HUB_INTENT = "ActivityModel.CREATE_HUB_INTENT";
namespace('juke.events').HUB_SELECTED = "ActivityModel.HUB_SELECTED";


var HubsTableCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, $location, HubsModel, Notifications){
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
        this.notifications.addEventListener(juke.events.CREATE_HUB_INTENT, this.createHub.bind(this));
        this.notifications.addEventListener(juke.events.HUB_SELECTED, this.hubSelected.bind(this));
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

    //Handle User Creating new Hub
    createHub:function(){
        console.log("create new hub");
    },

    //Handle User Selecting a Hub from the HubsTable
    hubSelected:function(hub){
        console.log("Here is the Hub selected:");
        console.log(hub);


    }


});

HubsTableCtrl.$inject = ['$scope', '$location', 'HubsModel', 'Notifications'];
