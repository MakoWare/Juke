var HubPageController = BaseController.extend({

    initialize:function($scope, $state, Notifications, UserModel, HubModel){
        this.userModel = UserModel;
        this.hubModel = HubModel;
        this.$state = $state;
        this.notifications = Notifications;
    },

    defineListeners:function(){
        this._super();
    },

    defineScope:function(){
        this._super();
        this.notifications.notify(models.events.BRAND_CHANGE, "Hub");
        this.$scope.hub = this.hubModel.hub;
    },

    destroy:function(){
        this._super();
    },


});

HubPageController.$inject = ['$scope', '$state', 'Notifications', 'UserModel', 'HubModel'];
