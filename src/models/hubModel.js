'use strict';

namespace('models.events').HUB_UPDATED = "ActivityModel.HUB_UPDATED";
namespace('models.events').HUBS_UPDATED = "ActivityModel.HUBS_UPDATED";

var HubModel = EventDispatcher.extend({
    hub: null,
    hubs : [],
    ParseService:null,
    notifications: null,

    getHubs: function(){
        return this.ParseService.getHubs().then(function(hubs){
            this.hubs = hubs;
        }.bind(this), function(error){
            console.log(error);
        });
    }
});


(function (){
    var HubModelProvider = Class.extend({
        instance: new HubModel(),

        $get: function(ParseService, Notifications){
            this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
            return this.instance;
        }
    });

    angular.module('HubModel',[])
        .provider('HubModel', HubModelProvider);
}());
