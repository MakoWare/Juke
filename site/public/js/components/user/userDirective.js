//Events
namespace('juke.events').CREATE_HUB_INTENT = "ActivityModel.CREATE_HUB_INTENT";

var UserDirective = BaseDirective.extend({

    notifications:null,

    init:function($scope,$elm, notifications){
	this.notifications = notifications;
        this._super($scope);
    },

    defineListeners:function(){
    },

    destroy:function(event){

    }
});

angular.module('juke.user',[])
    .directive('user',['Notifications',function(Notifications){
        var partial;
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            partial = 'partials/user/userMobile.html';
        } else {
            partial = 'partials/user/userDesktop.html';
        }

        return {
	    restrict:'C',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new UserDirective($scope,$elm,Notifications);
	    },
	    scope:true,
            templateUrl: partial
	};
    }]);
