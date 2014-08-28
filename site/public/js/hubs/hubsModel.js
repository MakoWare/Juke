//Events
namespace('notes.events').SLIDES_LOADED = "ActivityModel.SLIDES_LOADED";


//Hubs model, store hubs
var HubsModel = EventDispatcher.extend({

    //Injected by the provider
    ParseService:null,

    //Class Properties
    currentHub: null,
    hubs:null,


    //Load Hubs via Parse service
    getHubs: function(){
	this._notesService.loadSlides().then(this._handleLoadSlidesSuccess.bind(this),this._handleLoadSlidesError.bind(this));
    },

    //Get a Hub
    getHub: function(){
	if(this._currentSlide<this._slides.length-1){
	    this._currentSlide++;
	}else{
	    this._currentSlide = 0;
	}
    },




});



/**
 * Activity model, provider since all activities
 * in the application use the same model
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

    angular.module('hubs.HubsModel',[])
	.provider('HubsModel',HubsModelProvider);
}());
