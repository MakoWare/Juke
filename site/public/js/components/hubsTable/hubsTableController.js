//Events
namespace('juke.events').HUB_SELECTED = "ActivityModel.HUB_SELECTED";


var HubsTableCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, $location, HubsModel, Notifications){
        console.log("HubsTableCtrl.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.location = $location;

        this._super($scope);
        this.hubsModel.getHubsForTable();
    },

    defineScope:function(){
	this.$scope.instance="HubsTableController";
    },

    defineListeners:function(){
	this._super();
	this.notifications.addEventListener(juke.events.HUBS_LOADED, this.handleNewHubs.bind(this));
        this.notifications.addEventListener(juke.events.HUB_SELECTED, this.hubSelected.bind(this));
    },

    destroy:function(){
	this.notifications.removeEventListener(juke.events.HUBS_LOADED, this.handleNewHubs.bind(this));
	this.notifications.removeEventListener(juke.events.HUB_SELECTED, this.hubSelected.bind(this));
    },

    //Handle HubsModel getting new Hubs
    handleNewHubs:function(event){
        this.$scope.hubs = this.hubsModel.hubs;
        this.$scope.$apply();
    },


    //Handle User Selecting a Hub from the HubsTable
    hubSelected:function(event, hubId){
        this.hubsModel.currentHubID = hubId;
	this.location.path("hubs/" + hubId);
        this.$scope.$apply();
    }
});

HubsTableCtrl.$inject = ['$scope', '$location', 'HubsModel', 'Notifications'];
