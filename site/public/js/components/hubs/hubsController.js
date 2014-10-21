var HubsCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,
    userModel: null,

    init:function($scope, $location, $modal, HubsModel, UsersModel, Notifications){
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.userModel = UsersModel;
        this.location = $location;
        this.modal = $modal;
        this._super($scope);
    },

    defineScope:function(){
	this.$scope.instance="HubsController";
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this.$scope.isMobile = true;
        } else {
            this.$scope.isMobile = false;
        }
    },

    defineListeners:function(){
        this._super();
        this.notifications.addEventListener(juke.events.HUB_CREATED, this.hubCreated.bind(this));
        this.notifications.addEventListener(juke.events.CREATE_HUB_INTENT, this.createNewHubModal.bind(this));
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
            var modalInstance = self.modal.open({
                templateUrl: 'partials/hubModal.html',
                controller: 'HubModalCtrl',
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

HubsCtrl.$inject = ['$scope', '$location', '$modal', 'HubsModel', 'UsersModel', 'Notifications'];
