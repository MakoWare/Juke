var HubsTableDirective = BaseDirective.extend({

    notifications:null,
    elm:null,

    init:function($scope,$elm,notifications){
        console.log("HubsTableDirective.init()");
	this.notifications = notifications;
	this.elm = $elm;
	this._super($scope);

        //Initial Table Height
        this.setTableHeight();
    },

    defineListeners:function(){
        this.notifications.addEventListener(juke.events.HUBS_LOADED, this.handleNewHubs.bind(this));
        $(window).resize(this.setTableHeight);
    },

    setTableHeight: function(){
        var space = window.innerHeight - $('#hubsTableContent').offset().top;
        var tableHeight = (space - 50);
        $('#hubsTableContent').height(tableHeight);
    },

    //Handle HubsModel getting new Hubs
    handleNewHubs:function(event){
        $('.table > tbody > tr').click(this.hubSelected.bind(this));
    },

    //Handle User Clicking the Create new Hub button
    createHub:function(){
        this.notifications.notify(juke.events.CREATE_HUB_INTENT);
    },

    //Handle User selecting a Hub from the Hubs Table
    hubSelected:function(event){
        var hubId = event.currentTarget.getAttribute('id');
        this.notifications.notify(juke.events.HUB_SELECTED, hubId);
    },

    destroy:function(event){

    }
});

angular.module('juke.hubsTable',[])
    .directive('hubsTable',['Notifications',function(Notifications){
        return {
	    restrict:'C',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new HubsTableDirective($scope,$elm,Notifications);
	    },
	    scope:true,
            templateUrl: "partials/hubsTable.html?i=334"
	};
    }]);
