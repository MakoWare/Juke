'use strict';

//Hubs Table Controller
var HubsTableCtrl = BaseController.extend({

    notifications: null,
    hubsModel: null,

    //Init Controller
    init: function($scope, HubsModel, Notifications){
        console.log("HubsTableCtrl Init");
        this._super($scope);
        this.hubsModel = HubsModel;
        this.notifications = Notifications;
        this.$scope.$watch('this.hubsModel.hubs', function(){
            console.log("hubs changed");
        });


        this.hubsModel.getHubs();
        console.log(this.hubsModel);
    },

    defineScope:function(){
	this.$scope.instance="HubsTable";
    },

    //@Override
    defineListeners:function(){
	this._super();
//	this._notifications.addEventListener("event string", handler().bind(this);
    },

    //@Override
    destroy:function(){
//	this._notifications.removeEventListener("event string", handler().bind(this);
    }




});

HubsTableCtrl.$inject = ['$scope','HubsModel', 'Notifications'];
