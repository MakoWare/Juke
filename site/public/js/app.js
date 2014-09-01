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
	    when('/', {
		templateUrl: 'partials/main.html',
		controller: HubsTableCtrl}).
	    otherwise({redirectTo: '/'});


    });
