angular.module('juke', [
    'notifications',
    'overlay',
    'navbar',

    //User
    'UserModel',
    'loginModal',

    //Hubs
    'HubModel',
    'hubsList',
    'addHubModal',

    //Parse
    'ParseService',

    'ui.router'
]);
