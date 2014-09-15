var NavigationDirective = BaseDirective.extend({

    notifications:null,

    init:function($scope,notifications){
	this.notifications = notifications;
	this._super($scope);
    },

    defineListeners:function(){

    }
});

angular.module('navigation',[])
    .directive('navigation',['Notifications',function(Notifications){
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavigationDirective($scope,Notifications);
	    },
	    scope:true,
            templateUrl: 'partials/nav.html'
	};
    }]);
