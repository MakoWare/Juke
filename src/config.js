var getHubs = function(HubsModel){
    return HubsModel.getHubs();
};


angular.module('juke').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("hubs");

    $stateProvider
    /** Hubs **/
        .state('hubs', {
            url: "/hubs",
            templateUrl: "partials/hubs/hubsPage.html",
            controller: HubsPageController,
            resolve: {

            }
        });
});


angular.module('juke').config(function($provide) {
    $provide.decorator('$state', function($delegate, $rootScope) {
        $rootScope.$on('$stateChangeStart', function(event, state, params) {
            $delegate.next = state;
            $delegate.toParams = params;
        });
        return $delegate;
    });
});
