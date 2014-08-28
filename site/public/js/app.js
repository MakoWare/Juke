'use strict';

angular.module('juke', [
    'globalService',
    'parseService',
    'notifications',
    'juke.HubsModel',
    'ngRoute'
])
    .config(function($routeProvider) {
	$routeProvider.
	    when('/', {
		templateUrl: 'partials/main.html',
		controller: MainCtrl}).
	    otherwise({redirectTo: '/'});
    });
