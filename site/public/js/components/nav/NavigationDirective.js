var NavigationDirective = BaseController.extend({

    _notifications:null,

    init:function(scope,notifications){
        console.log("NavigationDirective init");
	this._super(scope);
	this._notifications = notifications;
    },

    defineListeners:function(){

    },

    defineScope:function(){
	this.$scope.instance="NavigationDirective";
    }
});


angular.module('navigation',[])
    .directive('navigation',['Notifications',function(Notifications){
        console.log('navdir');
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
