'use strict';

angular.module('juke', [
    'notifications',
    'globalService',
    'parseService',
    'navigation',
    'juke.HubsModel',
    'juke.hubsTable',
    'ngRoute'
])
    .config(function($routeProvider) {
	$routeProvider.
            when('/hubs', {
		templateUrl: 'partials/hubsTable.html',
		controller: HubsTableCtrl}).
	    otherwise({redirectTo: '/hubs'});


    });
