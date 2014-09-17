var NavigationDirective = BaseDirective.extend({

    notifications:null,

    init:function($scope, $location, notifications){
        console.log("NavigationDirective.init()");
	this.notifications = notifications;
        this.location = $location;
	this._super($scope);
    },

    defineListeners:function(){

    }
});

angular.module('navigation',[])
    .directive('navigation',['$location', 'Notifications',function($location, Notifications){
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new NavigationDirective($scope, $location, Notifications);
	    },
	    scope:true,
            templateUrl: 'partials/nav.html'
	};
    }]);
