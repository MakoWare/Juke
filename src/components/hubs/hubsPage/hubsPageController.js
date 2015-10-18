//Users Controller
var HubsPageController = BaseController.extend({

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
        this.$scope.currentUser = this.userModel.currentUser;
        this.$scope.openAddHubModal = this.openAddHubModal.bind(this);

        this.notifications.notify(models.events.BRAND_CHANGE, "Hubs");
        this.notifications.notify(models.events.HIDE_LOADING);
    },

    destroy:function(){
        this._super();
    },

    openAddHubModal: function(){
        this.notifications.notify(models.events.OPEN_ADD_HUB_MODAL);
    }
});

HubsPageController.$inject = ['$scope', '$state', 'Notifications', 'UserModel', 'HubModel'];
