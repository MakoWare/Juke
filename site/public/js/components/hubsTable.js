'use strict';

//Hubs Table Controller
var HubsTableCtrl = BaseController.extend({

    notifications: null,
    hubsModel: null,

    //Init Controller
    init: function($scope, Notifications){
        console.log("HubsTableCtrl Init");
        this._super($scope);
        this.notifications = Notifications;
        this.hubsModel.getHubs();
    },

    defineScope:function(){
	//Useless... for demo purpose
	this.$scope.instance="HubsTable";
    },

    //@Override
    defineListeners:function(){
	this._super();
//	this._notifications.addEventListener("event string", handler().bind(this);
    },

    //@Override
    destroy:function(){

    }
});

HubsTableCtrl.$inject = ['$scope','HubsModel', 'Notifications'];
