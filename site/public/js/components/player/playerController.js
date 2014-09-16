//Events
namespace('juke.events').PLAYER_PLAY = "ActivityModel.PLAYER_PLAY";
namespace('juke.events').PLAYER_STOP = "ActivityModel.PLAYER_STOP";
namespace('juke.events').PLAYER_NEXTSONG = "ActivityModel.PLAYER_NEXTSONG";

var PlayerController = BaseController.extend({
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

PlayerController.$inject = ['$scope', 'HubsModel', 'Notifications'];
