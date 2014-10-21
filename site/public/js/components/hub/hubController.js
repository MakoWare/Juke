//Events
namespace('juke.events').ADDING_SONGS_SHOWN = "ActivityModel.ADDING_SONGS_SHOWN";

var HubCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, $location, $modal, HubsModel, Notifications){
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.location = $location;
        this.modal = $modal;
        this._super($scope);
        this.hubsModel.currentHubId = $location.url().split("/")[$location.url().split("/").length - 1];
        this.hubsModel.getHubById(this.hubsModel.currentHubId);
    },

    defineScope:function(){
        var self = this;
	this.$scope.instance="HubController";
        this.$scope.currentView = "playlist";
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this.$scope.isMobile = true;
        } else {
            this.$scope.isMobile = false;
        }
        this.notifications.addEventListener(juke.events.CURRENT_HUB_LOADED, this.currentHubLoaded.bind(this));

        this.$scope.addingSongsButtonClick = function(){
            self.notifications.notify(juke.events.ADDING_SONGS_SHOWN);
        };
    },

    defineListeners:function(){
    },

    destroy:function(){

    },

    currentHubLoaded:function(){
        this.$scope.currentHub = this.hubsModel.currentHub;
        this.$scope.$apply();
    }

});

HubCtrl.$inject = ['$scope', '$location', '$modal', 'HubsModel', 'Notifications'];
