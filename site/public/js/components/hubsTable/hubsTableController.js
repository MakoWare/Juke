//Events
namespace('juke.events').CREATE_HUB_INTENT = "ActivityModel.CREATE_HUB_INTENT";
namespace('juke.events').HUB_SELECTED = "ActivityModel.HUB_SELECTED";


var HubsTableCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, $location, $modal, HubsModel, Notifications){
        console.log("HubsTableCtrl.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.location = $location;
        this.modal = $modal;

        this._super($scope);
        this.hubsModel.getHubsForTable();
    },

    defineScope:function(){
	this.$scope.instance="HubsTableController";
    },

    defineListeners:function(){
	this._super();
	this.notifications.addEventListener(juke.events.HUBS_LOADED, this.handleNewHubs.bind(this));
        this.notifications.addEventListener(juke.events.HUB_CREATED, this.hubCreated.bind(this));
        this.notifications.addEventListener(juke.events.CREATE_HUB_INTENT, this.createNewHubModal.bind(this));
        this.notifications.addEventListener(juke.events.HUB_SELECTED, this.hubSelected.bind(this));
    },

    destroy:function(){
	this.notifications.removeEventListener(juke.events.HUBS_LOADED, this.handleNewHubs.bind(this));
        this.notifications.removeEventListener(juke.events.HUB_CREATED, this.hubCreated.bind(this));
	this.notifications.removeEventListener(juke.events.CREATE_HUB_INTENT, this.createNewHubModal.bind(this));
	this.notifications.removeEventListener(juke.events.HUB_SELECTED, this.hubSelected.bind(this));
    },

    //Handle HubsModel getting new Hubs
    handleNewHubs:function(event){
        this.$scope.hubs = this.hubsModel.hubs;
        this.$scope.$apply();
    },

    //Handle User Creating new Hub
    createNewHubModal:function(){
        var self = this;
        var open = function (size) {
            var modalInstance = self.modal.open({
                templateUrl: 'partials/hubModal.html',
                controller: HubModalCtrl,
                size: size,
                resolve: {
                    HubsModel: function () {
                        return self.hubsModel;
                    }
                }
            });
        };
        open();
    },

    //Handle User Selecting a Hub from the HubsTable
    hubSelected:function(event, hubId){
        this.hubsModel.currentHub = hubId;
	this.location.path("hubs/" + hubId).replace();
        this.$scope.$apply();
    },

    //Handle User Createing a new Hub
    hubCreated:function(event){
	this.location.path("hubs/" + this.hubsModel.currentHub).replace();
        this.$scope.$apply();
    }

});

HubsTableCtrl.$inject = ['$scope', '$location', '$modal', 'HubsModel', 'Notifications'];
