var HubModalCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, $location, $modal, HubsModel, Notifications){
        console.log("HubModalCtrl.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.location = $location;
        this.modal = $modal;
        this._super($scope);
    },

    defineScope: function(){
        this.$scope.hub = {};
        this.$scope.hub.capabilities = {};
    },

    defineListeners:function(){
        $('#createHubButton').click(this.createNewHub.bind(this));
    },

    //Handle User Createing a new Hub
    createNewHub:function(){
        console.log("creating new Hub");
        //this.hubsModel.createNewHub();
    }


});

HubModalCtrl.$inject = ['$scope', 'HubsModel', 'Notifications'];
