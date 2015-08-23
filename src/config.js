var app = angular.module('juke');

var getHubs = function(HubModel){
    return HubModel.getHubs();
};

var getHubById = function(HubModel, $stateParams){
    var hubId = $stateParams.hubId;
    return HubModel.getHubById(hubId);
};


app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("hubs");

    $stateProvider
    /** Hubs **/
        .state('hubs', {
            url: "/hubs",
            templateUrl: "partials/hubs/hubsPage.html",
            controller: HubsPageController,
            resolve: {
                getHubs: getHubs
            }
        })
        .state('hub', {
            url: "/hubs/:hubId",
            templateUrl: "partials/hubs/hubPage.html",
            controller: HubPageController,
            resolve: {
                getHubById: getHubById
            }
        })
    /** Users **/
        .state('users', {
            url: "/users",
            templateUrl: "partials/users/usersPage.html",
            controller: UsersPageController,
            resolve: {
                //getUsers: getUsers
            }
        })
        .state('user', {
            url: "/user/:id",
            templateUrl: "partials/users/userPage.html",
            controller: UserPageController,
            resolve: {
                //getUsers: getUsers
            }
        });
});


app.config(function($provide) {
    $provide.decorator('$state', function($delegate, $rootScope) {
        $rootScope.$on('$stateChangeStart', function(event, state, params) {
            $delegate.next = state;
            $delegate.toParams = params;
        });
        return $delegate;
    });
});


app.config(function($provide) {
  $provide.decorator('$state', function($delegate, $rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, state, params) {
      $delegate.next = state;
      $delegate.toParams = params;
    });
    return $delegate;
  });
});
