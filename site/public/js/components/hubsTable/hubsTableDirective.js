//Events
namespace('juke.events').SEARCH_CHANGED = "ActivityModel.SEARCH_CHANGED";

var HubsTableDirective = BaseDirective.extend({

    notifications:null,
    elm:null,

    init:function($scope,$elm,notifications){
        console.log("HubsTableDirective.init()");
	this.notifications = notifications;
	this.elm = $elm;
	this._super($scope);

        //Init Table Height
        this.setTableHeight();
    },

    defineListeners:function(){
        this.notifications.addEventListener(juke.events.HUBS_LOADED, this.handleNewHubs.bind(this));
        this.notifications.addEventListener(juke.events.SEARCH_CHANGED, this.handleSearchChanged.bind(this));
        this.$scope.searchParam = "";
        $(window).resize(this.setTableHeight);
    },

    setTableHeight: function(){
        var space = window.innerHeight - $('#hubsTableContent').offset().top;
        var tableHeight = (space * .92);
        $('#hubsTableContent').height(tableHeight);
    },

    //Handle User searching
    handleSearchChanged:function(event, param){
        this.$scope.searchParam = param;
        this.$scope.$apply();
    },

    //Handle HubsModel getting new Hubs
    handleNewHubs:function(event){
        $('.table > tbody > tr').click(this.hubSelected.bind(this));
        $('.thumbnail').click(this.hubSelected.bind(this));
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
        var partial;
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            partial = "partials/hubsTable/hubsTableMobile.html";
        } else {
            partial = "partials/hubsTable/hubsTableDesktop.html";
        }

        return {
	    restrict:'C',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new HubsTableDirective($scope,$elm,Notifications);
	    },
	    scope:true,
            templateUrl: partial
	};
    }]);
