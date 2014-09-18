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
    }



});

HubModalCtrl.$inject = ['$scope', 'HubsModel', 'Notifications'];
