//Events

var PlayerContreller = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, HubsModel, Notifications){
        console.log("PlayerController.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this._super($scope);
    },

    defineScope:function(){
	this.$scope.instance="PlayerController";
    },

    defineListeners:function(){
	this._super();
    },

    destroy:function(){

    }

});

PlayerContreller.$inject = ['$scope', 'HubsModel', 'Notifications'];
