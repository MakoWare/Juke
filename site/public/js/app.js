'use strict';

angular.module('juke', [
    'notifications',
    'globalService',
    'parseService',
    'navigation',
    'juke.HubsModel',
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
		controller: PlayerController}).
	    otherwise({redirectTo: '/hubs'});
    });
