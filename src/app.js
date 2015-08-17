angular.module('juke', [
    'notifications',
    'overlay',
    'navbar',

    //User
    'UserModel',

    //Hubs
    'HubModel',
    'hubsList',
    'addHubModal',

    //Parse
    'ParseService',

    'ui.router',
    'ngAnimate'
]);
