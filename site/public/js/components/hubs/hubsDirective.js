//Events
namespace('juke.events').CREATE_HUB_INTENT = "ActivityModel.CREATE_HUB_INTENT";

var HubsDirective = BaseDirective.extend({

    notifications:null,
    elm:null,

    init:function($scope,$elm, notifications){
	this.notifications = notifications;
	this.elm = $elm;
        this._super($scope);
    },

    defineListeners:function(){
        var self = this;
        this.$scope.openModal = function(){
            self.createNewHubModal();
        };

    },

    createNewHubModal:function(){
        this.notifications.notify(juke.events.CREATE_HUB_INTENT);
    },

    destroy:function(event){

    }
});

angular.module('juke.hubs',[])
    .directive('hubs',['Notifications',function(Notifications){
        return {
	    restrict:'C',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new HubsDirective($scope,$elm,Notifications);
	    },
	    scope:true,
            templateUrl: 'partials/hubs/hubsPartial.html'
	};
    }]);
