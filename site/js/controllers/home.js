'use strict';

//Home Controller
var HomeCtrl = BaseController.extend({
    _notifications: null,

    //Init Controller
    init: function($scope, Notifications){
        console.log("HomeCtrl Init");
        this._notifications = Notifications;
        this._super($scope);

    },

    defineScope:function(){
	//Useless... for demo purpose
	this.$scope.instance="Home";
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

HomeCtrl.$inject = ['$scope', 'ParseService', 'Notifications'];
