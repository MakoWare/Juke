var SongFinderDirective = BaseDirective.extend({

    notifications:null,
    elm:null,

    init:function($scope,$elm,notifications){
        console.log("SongFinderDirective.init()");
	this.notifications = notifications;
	this.elm = $elm;
	this._super($scope);
    },

    defineListeners:function(){

    },

    destroy:function(event){

    }
});

angular.module('juke.songFinder',[])
    .directive('songFinder',['Notifications',function(Notifications){
        console.log("songFinder");
        return {
	    restrict:'C',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new SongFinderDirective($scope,$elm,Notifications);
	    },
	    scope:true,
            templateUrl: "partials/songFinder.html"
	};
    }]);
