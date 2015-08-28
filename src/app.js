angular.module('juke', [
    'notifications',
    'overlay',
    'navbar',

    //User
    'UserModel',
    'userList',
    'userListItem',
    'loginModal',

    //Hubs
    'HubModel',
    'hubList',
    'hubListItem',
    'hubInfo',
    'addHubModal',

    //Player
    'player',
    'youtubePlayer',

    //Parse
    'ParseService',

    'ui.router'
]);
