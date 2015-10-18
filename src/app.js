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

    //Songs
    'SongModel',
    'songList',
    'songListItem',
    'addSongModal',

    //Player
    'player',
    'youtubePlayer',

    //Playlist
    'playlist',

    //Parse
    'ParseService',

    'ui.router'
]);
