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
        this.notifications.notify(models.events.BRAND_CHANGE, "Hubs");
        console.log("yo");

    },

    destroy:function(){
        this._super();

    }

});

HubsPageController.$inject = ['$scope', '$state', 'Notifications', 'UserModel', 'HubModel'];
