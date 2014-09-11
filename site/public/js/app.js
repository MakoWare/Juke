'use strict';

angular.module('juke', [
    'navigation',
    'notifications',
    'juke.hubsTable',
    'globalService',
    'parseService',
    'juke.HubsModel',

    'ngRoute'
])
    .config(function($routeProvider) {
	$routeProvider.
            /*
	    when('/', {
		templateUrl: 'partials/main.html',
		controller: MainCtrl}).
	    otherwise({redirectTo: '/'});

*/
	    when('/hubs', {
		templateUrl: 'partials/hubsTable.html',
		controller: HubsTableCtrl}).
	    otherwise({redirectTo: '/hubs'});


    });
