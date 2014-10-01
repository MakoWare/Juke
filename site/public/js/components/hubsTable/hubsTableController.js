//Events
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
    hubSelected:function(event, hub){
        if(hub.passcode == ""){
            this.hubsModel.currentHubID = hub.objectId;
	    this.location.path("hubs/" + hub.objectId);
            this.$scope.$apply();
        } else {
            var self = this;
            var modalInstance = this.modal.open({
                templateUrl: 'partials/hubs/passwordModal.html',
                controller: 'PasswordModalCtrl',
                size: 'sm',
                resolve: {
                    passcode: function () {
                        return hub.passcode;
                    }
                }
            });

            modalInstance.result.then(function (successful) {
                if(successful){
                    self.hubsModel.currentHubID = hub.objectId;
	            self.location.path("hubs/" + hub.objectId);
                    self.$scope.$apply();
                } else {

                }
            });
        }

    }
});

HubsTableCtrl.$inject = ['$scope', '$location', '$modal', 'HubsModel', 'Notifications'];
