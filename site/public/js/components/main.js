'use strict';

//Home Controller
var MainCtrl = BaseController.extend({
    _notifications: null,

    //Init Controller
    init: function($scope, Notifications){
        this._notifications = Notifications;
        this._super($scope);

    },

    defineScope:function(){
	this.$scope.instance="MainController";
    },

    //@Override
    defineListeners:function(){
	this._super();

    },

    //@Override
    destroy:function(){

    }
});

MainCtrl.$inject = ['$scope', 'ParseService', 'Notifications'];
