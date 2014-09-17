var NavigationDirective = BaseDirective.extend({

    notifications:null,

    init:function($scope,notifications){
        console.log("NavigationDirective.init()");
	this.notifications = notifications;
	this._super($scope);
    },

    defineListeners:function(){
        console.log("Setting up navigation listeners");

        $(window).on("navigate", function (event, data) {
            var direction = data.state.direction;
            if (direction == 'back') {
                alert("This dude is tring to escape! stop him!");
                console.log("This dude is tring to escape! stop him!");

            }
            if (direction == 'forward') {
                alert("This dude is going forward");
                console.log("This dude is going forward");

            }
        });
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
