angular.module('juke', [
    'notifications',
    'overlay',
    'navbar',

    //User
    'UserModel',
    'loginModal',

    //Hubs
    'HubModel',
    'hubList',
    'hubListItem',
    'addHubModal',

    //Parse
    'ParseService',

    'ui.router'
]);
