'use strict';

angular.module('juke', [
    'notifications',
    'parseService',
    'youtubeService',
    'navigation',
    'juke.HubsModel',
    'juke.UsersModel',
    'juke.SongsModel',
    'juke.user',
    'juke.hubs',
    'juke.hubsTable',
    'juke.player',
    'juke.songFinder',
    'juke.playList',
    'ui.bootstrap',
    'ngRoute'
])
    .config(function($routeProvider) {
	$routeProvider.
            when('/hubs', {
		templateUrl: 'partials/hubs/hubs.html',
		controller: HubsCtrl}).
            when('/hubs/:id', {
		templateUrl: 'partials/hub.html',
		controller: HubCtrl}).
//            when('/users/:username', {
//		templateUrl: 'partials/user/user.html',
//		controller: UserCtrl}).
	    otherwise({redirectTo: '/hubs'});
    });
