//Events
namespace('juke.events').SONGS_SEARCH = "ActivityModel.SONGS_SEARCH";
namespace('juke.events').SONGS_ADD = "ActivityModel.SONGS_ADD";

var SongFinderDirective = BaseDirective.extend({

    notifications:null,
    elm:null,

    init:function($scope,$elm,notifications){
        console.log("SongFinderDirective.init()");
	this.notifications = notifications;
	this.elm = $elm;
	this._super($scope);

        //Init Table Height
        this.setTableHeight();
    },

    defineListeners:function(){
        $('#findSongsButton').click(this.findSongs.bind(this));
        this.notifications.addEventListener(juke.events.SONGS_FOUND, this.handleSongsFound.bind(this));
        $(window).resize(this.setTableHeight);
    },

    handleSongsFound:function(){
        $('.table > tbody > tr').click(this.songSelected.bind(this));
        this.setTableHeight();
    },

    songSelected:function(){
        var songId = event.currentTarget.getAttribute('id');
        this.notifications.notify(juke.events.SONGS_ADD, songId);
    },

    setTableHeight: function(){
        if($('#foundSongsTable').is(':visible')){
            var space = window.innerHeight - $('#foundSongsTable').offset().top;
            var tableHeight = space;
            $('#foundSongsTable').height(tableHeight);
        }
    },

    findSongs:function(){
        var query = $('#songSearchQuery').val();
        //For now Just pass query, easy to extend params for Service type, i.e, spotify
        this.notifications.notify(juke.events.SONGS_SEARCH, query);
    },

    destroy:function(event){

    }
});

angular.module('juke.songFinder',[])
    .directive('songFinder',['Notifications',function(Notifications){
        var partial;
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            partial = "partials/songFinder/songFinderMobile.html";
        } else {
            partial = "partials/songFinder/songFinderDesktop.html";
        }

        return {
	    restrict:'C',
	    isolate:true,
	    link: function($scope,$elm,$attrs){
		new SongFinderDirective($scope,$elm,Notifications);
	    },
	    scope:true,
            templateUrl: partial
	};
    }]);
