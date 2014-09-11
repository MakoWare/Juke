//Events
namespace('juke.events').HUBS_LOADED = "ActivityModel.HUBS_LOADED";

//Hubs model, holds hubs
var HubsModel = EventDispatcher.extend({
    currentHub: null,
    hubs:null,

    //Injected by the provider
    ParseService:null,
    notifications: null,

    //Load Hubs via Parse service
    getHubs: function(){
        var self = this;

	this.ParseService.getHubs().then(function(results){
            console.log("HubsModel " + "Got Hubs:");
            console.log(results);
            this.hubs = results;
            self.notifications.notify(juke.events.HUBS_LOADED);
        });
    },

    //Get a Hub
    getHub: function(){

    }
});

//Provider, as all components will use the same HubsModel instance, $inject will init once, then pull the same object from Instance Cache for all other $injects
(function (){
    var HubsModelProvider = Class.extend({
	instance: new HubsModel(),

        //Init HubsModel
	$get:['ParseService', 'Notifications', function(ParseService, Notifications){
	    this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
	    return this.instance;
	}]
    });

    angular.module('juke.HubsModel',[])
	.provider('HubsModel',HubsModelProvider);
}());
