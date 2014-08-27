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
	this.$scope.instance="Home";
    },

    //@Override
    defineListeners:function(){
	this._super();

    },

    //@Override
    destroy:function(){

    }
});

HomeCtrl.$inject = ['$scope', 'ParseService', 'Notifications'];
