//Events
var HubCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, $location, $modal, HubsModel, Notifications){
        console.log("HubCtrl.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.location = $location;
        this.modal = $modal;
        this._super($scope);

        this.hubsModel.currentHubId = $location.url().split("/")[$location.url().split("/").length - 1];
        this.hubsModel.getHubById(this.hubsModel.currentHubId);
    },

    defineScope:function(){
	this.$scope.instance="HubController";
        this.notifications.addEventListener(juke.events.CURRENT_HUB_LOADED, this.currentHubLoaded.bind(this));
    },

    defineListeners:function(){
	this._super();
    },

    destroy:function(){

    },

    currentHubLoaded:function(){
        this.$scope.currentHub = this.hubsModel.currentHub;
        this.$scope.$apply();
    }

});

HubCtrl.$inject = ['$scope', '$location', '$modal', 'HubsModel', 'Notifications'];
