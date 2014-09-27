var PlayerDirective = BaseDirective.extend({

    notifications:null,
    elm:null,

    init:function($scope,$elm,notifications){
        console.log("PlayerDirective.init()");
	this.notifications = notifications;
	this.elm = $elm;
	this._super($scope);
    },

    defineListeners:function(){

    },


    destroy:function(event){

    }
});

angular.module('juke.player',[])
    .directive('player',['Notifications',function(Notifications){
        console.log("player");
        return {
	    restrict:'C',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new PlayerDirective($scope,$elm,Notifications);
	    },
	    scope:true,
            templateUrl: "partials/player.html"
	};
    }]);
