'use strict';

angular.module('juke', [
    'globalService',
    'parseService',
    'notifications',
    'ngRoute'
])
    .config(function($routeProvider) {
	$routeProvider.
	    when('/', {
		templateUrl: 'partials/home.html',
		controller: HomeCtrl}).
	    when('/about', {
		templateUrl: 'partials/about.html',
		controller: LoginCtrl}).
	    when('/hubs', {
		templateUrl: 'partials/hubsList.html',
		controller: HubCtrl}).
	    when('/hubs/:hubId', {
		templateUrl: 'partials/hub.html',
		controller: HubCtrl}).
	    when('/player/:hubId', {
		templateUrl: 'partials/player.html',
		controller: PlayerCtrl}).
	    otherwise({redirectTo: '/'});
    });