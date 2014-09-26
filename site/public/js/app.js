'use strict';

angular.module('juke', [
    'notifications',
    'globalService',
    'parseService',
    'youtubeService',
    'navigation',
    'juke.HubsModel',
    'juke.UsersModel',
    'juke.SongsModel',
    'juke.hubsTable',
    'juke.player',
    'juke.songFinder',
    'ui.bootstrap',
    'ngRoute'
])
    .config(function($routeProvider) {
	$routeProvider.
            when('/hubs', {
		templateUrl: 'partials/hubs.html',
		controller: HubsCtrl}).
            when('/hubs/:id', {
		templateUrl: 'partials/hub.html',
		controller: HubCtrl}).
	    otherwise({redirectTo: '/hubs'});
    });
