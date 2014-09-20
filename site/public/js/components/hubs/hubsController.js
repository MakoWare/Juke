//Events
namespace('juke.events').CREATE_HUB_INTENT = "ActivityModel.CREATE_HUB_INTENT";

var HubsCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, $location, $modal, HubsModel, Notifications){
        console.log("HubsCtrl.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.location = $location;
        this.modal = $modal;
        this._super($scope);
    },

    defineScope:function(){
	this.$scope.instance="HubsController";
    },

    defineListeners:function(){
	this._super();
        this.notifications.addEventListener(juke.events.HUB_CREATED, this.hubCreated.bind(this));
        this.notifications.addEventListener(juke.events.CREATE_HUB_INTENT, this.createNewHubModal.bind(this));
        $('#openModalButton').click(this.createNewHubModal.bind(this));
    },

    destroy:function(){
        this.notifications.removeEventListener(juke.events.HUB_CREATED, this.hubCreated.bind(this));
	this.notifications.removeEventListener(juke.events.CREATE_HUB_INTENT, this.createNewHubModal.bind(this));
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

    //Handle User Createing a new Hub
    hubCreated:function(event){
	this.location.path("hubs/" + this.hubsModel.currentHub);
        this.$scope.$apply();
    }

});

HubsCtrl.$inject = ['$scope', '$location', '$modal', 'HubsModel', 'Notifications'];
