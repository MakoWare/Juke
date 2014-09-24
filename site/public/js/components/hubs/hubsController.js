//Events
namespace('juke.events').CREATE_HUB_INTENT = "ActivityModel.CREATE_HUB_INTENT";

var HubsCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,
    userModel: null,

    init:function($scope, $location, $modal, HubsModel, UserModel, Notifications){
        console.log("HubsCtrl.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.userModel = UserModel;
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
        if(this.userModel.currentUser == null){
            alert("Sorry, but you  must be signed in to create a Hub");
        } else {
            var self = this;
            console.log(this.modal);

            var modalInstance = self.modal.open({
                templateUrl: 'partials/hubModal.html',
                controller: HubModalCtrl,
                resolve: {
                    HubsModel: function () {
                        return self.hubsModel;
                    }
                }
            });
        }
    },

    //Handle User Createing a new Hub
    hubCreated:function(event){
	this.location.path("hubs/" + this.hubsModel.currentHub.id);
        this.$scope.$apply();
    }

});

HubsCtrl.$inject = ['$scope', '$location', '$modal', 'HubsModel', 'UserModel', 'Notifications'];
