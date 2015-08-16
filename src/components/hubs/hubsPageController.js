//Users Controller
var HubsPageController = BaseController.extend({

    /**** OVERRIDE Methods ****/
    initialize:function($scope, $location, Notifications, ParseService, UserModel, $state, HubModel){
        this.$location = $location;
        this.ParseService = ParseService;
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
        console.log("yo");
    },

    destroy:function(){
        this._super();

    }

});

HubsPageController.$inject = ['$scope', '$location', 'Notifications', 'ParseService', 'UserModel', '$state','HubModel'];
