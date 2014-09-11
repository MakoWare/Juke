var HubsTableDirective = BaseController.extend({

    _notifications:null,
    _elm:null,

    init:function($scope,$elm,notifications){
        console.log("HubsTableDirective init()");
	this._notifications = notifications;
	this._elm = $elm;
	this._super($scope);

        console.log($scope);
    },

    defineListeners:function(){

    },

    defineScope:function(){
	this.$scope.instance="HubsTableDirective";
    },

    destroy:function(event){

    }
});


angular.module('juke.hubsTable',[])
    .directive('hubsTable',['Notifications',function(Notifications){
        console.log("hubsTableDirective");
	return {
	    restrict:'A',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new HubsTableDirective($scope,$elm,Notifications);
	    },
	    scope:true,
            templateUrl: 'partials/hubsTablePartial.html'

	};
    }]);
