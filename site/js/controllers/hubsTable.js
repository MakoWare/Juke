'use strict';

//Hubs Table Controller
var HubsTableCtrl = BaseController.extend({

    _notifications: null,
    hubs: {},


    //Init Controller
    init: function($scope, Notifications){
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

//	this._notifications.addEventListener(ui.navigation.events.NEXT,this._handleNavigationEvents.bind(this));
    },





    //@Override
    destroy:function(){
	//this._notifications.removeEventListener(notes.slide.events.TRANSITION_END,this._handleTransitionEnd.bind(this));
    }




});

HubsTableCtrl.$inject = ['$scope','ParseService'];
