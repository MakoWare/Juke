'use strict';
namespace('models.events').PLAYING = "ActivityModel.PLAYING";
namespace('models.events').STOPPED = "ActivityModel.STOPPED";
namespace('models.events').NEXT_SONG = "ActivityModel.NEXT_SONG";
namespace('models.events').SONGS_LOADED = "ActivityModel.SONGS_LOADED";

var PlayerDirective = BaseDirective.extend({
    notifications: null,

    init: function($scope, $rootScope, Notifications){
        this.$rootScope = $rootScope;
        this.notifications = Notifications;
        this._super($scope);
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
        console.log("hi");
    },

    destroy: function(){
        this._super();
    },

});

angular.module('player',[])
    .directive('player', function($rootScope, Notifications){
	return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope){
		new PlayerDirective($scope, $rootScope, Notifications);
	    },
	    scope:true,
            templateUrl: "partials/player/player.html"
	};
    });
