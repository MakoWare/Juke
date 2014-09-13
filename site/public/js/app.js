'use strict';

angular.module('juke', [
    'notifications',
    'globalService',
    'parseService',
    'navigation',
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
