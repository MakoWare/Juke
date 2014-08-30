//Events
//namespace('notes.events').HUBS_LOADED = "ActivityModel.HUBS_LOADED";


//Hubs model, store hubs
var HubsModel = EventDispatcher.extend({

    //Injected by the provider
    ParseService:null,

    //Class Properties
    currentHub: null,
    hubs:null,

    //Load Hubs via Parse service
    getHubs: function(){
	this.ParseService.getHubs(function(results){
            console.log(results);
            this.hubs = results;
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
 * Activity model provider all components
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
