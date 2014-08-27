'use strict';

//Hubs Table Controller
var HubsTableCtrl = BaseController.extend({

    _notifications: null,
    hubs: {},

    //Init Controller
    init: function($scope, Notifications){
        console.log("HubsTableCtrl Init");
        this._notifications = Notifications;
        this._super($scope);

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

HubsTableCtrl.$inject = ['$scope','ParseService', 'Notifications'];
