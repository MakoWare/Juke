//Events
namespace('juke.events').HUBS_LOADED = "ActivityModel.HUBS_LOADED";

//Hubs model, holds hubs
var HubsModel = EventDispatcher.extend({
    currentHub: null,
    hubs:null,

    //Injected by the provider
    ParseService:null,

    //Load Hubs via Parse service
    getHubs: function(){
	this.ParseService.getHubs().then(function(results){
            console.log("Got Hubs:");
            console.log(results);
            this.hubs = results;

            //Let'em know
            console.log("Hey, I got new Hubs yo");
        });
    },

    //Get a Hub
    getHub: function(){
	if(this._currentSlide<this._slides.length-1){
	    this._currentSlide++;
	}else{
	    this._currentSlide = 0;
	}
    }
});

/**
 * Activity model provider, all components
 * in the application will use the same model
 */
(function (){
    var HubsModelProvider = Class.extend({
	instance: new HubsModel(),

        //Init HubsModel
	$get:['ParseService',function(ParseService){
	    this.instance.ParseService = ParseService;
	    return this.instance;
	}]
    });

    angular.module('juke.HubsModel',[])
	.provider('HubsModel',HubsModelProvider);
}());
