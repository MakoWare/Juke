'use strict';

namespace('models.events').HUB_UPDATED = "ActivityModel.HUB_UPDATED";
namespace('models.events').HUBS_UPDATED = "ActivityModel.HUBS_UPDATED";

var HubModel = EventDispatcher.extend({
    hub: null,
    hubs : [],
    ParseService:null,
    notifications: null,
    currentSong: null,

    getHubs: function(){
        return this.ParseService.getHubs().then(function(hubs){
            this.hubs = hubs;
            return hubs;
        }.bind(this), function(error){
            return error;
        });
    },

    getHubById: function(hubId){
        return this.ParseService.getHubById(hubId).then(function(hub){
            this.hub = hub;
            return hub;
        }.bind(this), function(error){
            return error;
        });
    },

    createHub: function(hub){
        return this.ParseService.createHub(hub).then(function(hub){
            this.hub = hub;
            return hub;
        }.bind(this), function(error){
            return error;
        });
    },

    addSongToPlaylist: function(song){
        return this.ParseService.addSongToPlaylist(song, this.hub).then(function(result){
            console.log(result);

        }.bind(this));
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
