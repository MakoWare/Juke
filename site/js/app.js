'use strict';

angular.module('juke', [
    'parseService'
])
    .config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	    when('/', {
		templateUrl: 'partials/login.html',
		controller: LoginCtrl}).
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
    }]);
