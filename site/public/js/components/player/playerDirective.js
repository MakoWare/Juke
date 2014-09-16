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
        //Broken, not picking up click or table row
        $('.table > tr').click(this.hubSelected.bind(this));

        $('#createHubButton').click(this.createHub.bind(this));

    },

    //Handle User Clicking the Create new Hub button
    createHub:function(){
        this.notifications.notify(juke.events.CREATE_HUB_INTENT);
    },

    //Handle User selecting a Hub from the Hubs Table
    hubSelected:function(){
        this.notifications.notify(juke.events.HUB_SELECTED);
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
	    scope:true
	};
    }]);
