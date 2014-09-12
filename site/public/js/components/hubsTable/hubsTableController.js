var HubsTableCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,

    init:function($scope, HubsModel, Notifications){
        console.log("HubsTableCtrl.init()");
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this._super($scope);
        this.hubsModel.getHubs();
    },

    defineScope:function(){
	this.$scope.instance="HubsTableController";
        this.$scope.createHub = this.createHub;
    },

    defineListeners:function(){
	this._super();
	this.notifications.addEventListener(juke.events.HUBS_LOADED, this.handleNewHubs.bind(this));
    },

    destroy:function(){
	this.notifications.removeEventListener(juke.events.HUBS_LOADED, this.handleNewHubs.bind(this));
    },

    //Handle HubsModel getting new Hubs
    handleNewHubs:function(event){
        console.log("So I hear you got new Hubs:");
        console.log(this.hubsModel.hubs);
        this.$scope.hubs = this.hubsModel.hubs;
        this.$scope.$apply();

    },

    createHub:function(){
        console.log("create new hub");
    }


});

HubsTableCtrl.$inject = ['$scope','HubsModel', 'Notifications'];
