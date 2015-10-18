(function(global) {
  "use strict";
  var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  function BaseClass(){}

  // Create a new Class that inherits from this class
  BaseClass.extend = function(props) {
    var _super = this.prototype;

    // Set up the prototype to inherit from the base class
    // (but without running the init constructor)
    var proto = Object.create(_super);

    // Copy the properties over onto the new prototype
    for (var name in props) {
      // Check if we're overwriting an existing function
      proto[name] = typeof props[name] === "function" &&
        typeof _super[name] == "function" && fnTest.test(props[name])
        ? (function(name, fn){
            return function() {
              var tmp = this._super;

              // Add a new ._super() method that is the same method
              // but on the super-class
              this._super = _super[name];

              // The method only need to be bound temporarily, so we
              // remove it when we're done executing
              var ret = fn.apply(this, arguments);
              this._super = tmp;

              return ret;
            };
          })(name, props[name])
        : props[name];
    }

    // The new constructor
    var newClass = typeof proto.init === "function"
      ? proto.hasOwnProperty("init")
        ? proto.init // All construction is actually done in the init method
        : function SubClass(){ _super.init.apply(this, arguments); }
      : function EmptyClass(){};

    // Populate our constructed prototype object
    newClass.prototype = proto;

    // Enforce the constructor to be what we expect
    proto.constructor = newClass;

    // And make this class extendable
    newClass.extend = BaseClass.extend;

    return newClass;
  };

  // export
  global.Class = BaseClass;
})(this);

var BaseController = Class.extend({
  scope: null,

  init:function(scope){
    // set the scope
    this.$scope = scope;

    // call the first lifecycle method
    this.initialize.apply(this,arguments);

    // bind the destroy event with this class
    this.$scope.$on('$destroy',this.destroy.bind(this));

    // call the second lifecycle method
    this.defineListeners();

    // call the last lifecycle method
    this.defineScope();
  },

  initialize:function(){
    //OVERRIDE
  },

  defineListeners: function(){
    //OVERRIDE
  },

  defineScope: function(){
    //OVERRIDE
  },

  destroy:function(event){
    //OVERRIDE
  }
});

BaseController.$inject = ['$scope'];

var BaseDirective = Class.extend({
  scope: null,

  init:function(scope){
    // set the scope
    this.$scope = scope;

    // call the first lifecycle method
    this.initialize.apply(this,arguments);

    // bind the destroy event with this class
    this.$scope.$on('$destroy',this.destroy.bind(this));

    // call the second lifecycle method
    this.defineListeners();

    // call the last lifecycle method
    this.defineScope();
  },

  initialize:function(){
    //OVERRIDE
  },

  defineListeners: function(){
    //OVERRIDE
  },

  defineScope: function(){
    //OVERRIDE
  },

  destroy:function(event){
    //OVERRIDE
  }
});

BaseDirective.$inject = ['$scope'];

/**
* Event dispatcher class,
* add ability to dispatch event
* on native classes.
*
* Use of Class.js
*
* @author universalmind.com
*/
var EventDispatcher = Class.extend({
    _listeners:{},

    /**
    * Add a listener on the object
    * @param type : Event type
    * @param listener : Listener callback
    */  
    addEventListener:function(type,listener){
        if(!this._listeners[type]){
            this._listeners[type] = [];
        }
        this._listeners[type].push(listener)
    },


    /**
       * Remove a listener on the object
       * @param type : Event type
       * @param listener : Listener callback
       */  
    removeEventListener:function(type,listener){
      if(this._listeners[type]){
        var index = this._listeners[type].indexOf(listener);

        if(index!==-1){
            this._listeners[type].splice(index,1);
        }
      }
    },


    /**
    * Dispatch an event to all registered listener
    * @param Mutiple params available, first must be string
    */ 
    dispatchEvent:function(){
        var listeners;

        if(typeof arguments[0] !== 'string'){
            console.warn('EventDispatcher','First params must be an event type (String)')
        }else{
            listeners = this._listeners[arguments[0]];

            for(var key in listeners){
                //This could use .apply(arguments) instead, but there is currently a bug with it.
                listeners[key](arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);
            }
        }
    }
})



angular.module('GoogleCharts',[])
.factory('googleChartApiLoader', ['$rootScope', '$q', googleChartApiLoader]);

function googleChartApiLoader($rootScope, $q) {
    var apiPromise = $q.defer();

    if($('#googleChartsScript').length===0){
        var onScriptLoad = function () {
            var onLoadCallback = function(){
                apiPromise.resolve(window.google);
            };

            window.google.load('visualization', '1.0', {'packages':['corechart', 'bar'], 'callback':onLoadCallback});
            // window.google.setOnLoadCallback(onLoadCallback);
        };

        var scriptTag = $('<script id="googleChartsScript" type="text/javascript" src="https://www.google.com/jsapi"></script>');

        // var head = document.getElementsByTagName('head')[0];
        // var script = document.createElement('script');

        // scriptTag.on('load', onScriptLoad);
        //
        // $('body').append(scriptTag);

        $.getScript("https://www.google.com/jsapi", function(data, textStatus, jqxhr){
            if(jqxhr.status===200){
                onScriptLoad();
            } else {
                apiPromise.reject({code:jqxhr.status, status:textStatus});
            }
        });

    } else {
        apiPromise.resolve(window.google);
    }


    return apiPromise.promise;
}

/**
* Simple namespace util to extand Class.js functionality
* and wrap classes in namespace.
* @author tommy.rochette[followed by the usual sign]universalmind.com
* @type {*}
* @return Object
*/
window.namespace = function(namespaces){
   'use strict';
   var names = namespaces.split('.');
   var last  = window;
   var name  = null;
   var i     = null;

   for(i in names){
       name = names[i];

       if(last[name]===undefined){
           last[name] = {};
       }

       last = last[name];
   }
   return last;
};

(function () {
   'use strict';
   /**
	 * Create a global event dispatcher
	 * that can be injected accross multiple components
	 * inside the application
	 *
	 * Use of Class.js
	 * @type {class}
	 * @author universalmind.com
	 */
   var NotificationsProvider = Class.extend({

       instance: new EventDispatcher(),

       /**
        * Configures and returns instance of GlobalEventBus.
        *
        * @return {GlobalEventBus}
        */
       $get: [function () {
       	   this.instance.notify = this.instance.dispatchEvent;
           return this.instance;
       }]
   });

   angular.module('notifications', [])
       .provider('Notifications', NotificationsProvider);
}());
angular.module('CustomModule',[])

.directive('matDropdownItem', function() {

  var dropdownId;

  var link = function(scope, elm, attrs, ctrl) {
    if(scope.$first === true){
      dropdownId = $(elm).closest('ul.dropdown-content').attr('id');
    }
    if(scope.$last === true){
      var dropdown = $('a.dropdown-button[data-activates="'+dropdownId+'"]');
      var options = dropdown.data('dropdown-options');
      dropdown.dropdown(options);
    }

    var params = attrs.matDropdownItem;
    if(params){
      var splits = params.split('('),
          funcName,
          pName,
          hasParam = false;

      if(splits.length>1){
        funcName = splits[0];
        pName = splits[1].split(')')[0];
        hasParam = true;
      }

      $(elm).on('click.'+params, function(event){
        event.preventDefault();
        if(hasParam){
          scope[funcName](scope[pName]);
        }
      });

      scope.$on('$destroy', function(){
        $(elm).off('click.'+params);
      });
    }
  };

  return {
    restrict: 'A',
    link: link
  };
})

.directive('noScroll', function(){

  var link = function(scope, el, attrs){
    $(el).on('focus.noScroll', function(e){
      $(this).on('mousewheel.noScroll',function(e){
        e.preventDefault();
      });
    });

    $(el).on('blur.noScroll', function(e){
      $(this).off('mousewheel.noScroll');
    });

    scope.$on('$destroy', function(){
      $(el).off('.noScroll');
    });
  };

  return {
    restrict: 'C',
    link:link,
    scope:{}
  };
})

;

(function ($) {
    $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            this.trigger('$'+ev);
            return el.apply(this, arguments);
        };
    });
})(jQuery);

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

angular.module('mw.materialize',['mw.materialize.matSelect','ui.materialize.inputfield']);

angular.module('mw.materialize.matSelect',[])
.directive('matSelect', function(){

    var traverse = function(obj, str){
        var keys = str.split('.'),
        newObj = obj;
        for(var i=0,l=keys.length; i<l; i++){
            newObj = newObj[keys[i]];
        }
        return newObj;
    };

    var link = function(scope, element, attrs, ctrls){
        var ngModel = ctrls[0],
        params = attrs.matSelect;

        var go = function(){
            $(element).material_select();

            if(params){
                $(element).siblings("input.select-dropdown").val(ngModel.$viewValue);
            }
        };

        if(params){
            ngModel.$formatters.push(function(val) {
                var ret = val ? traverse(val,params) : val;
                return ret;
            });
        }

        scope.$watch(attrs.ngModel, go);

    };

    return {
        restrict: 'A',
        require: ['ngModel'],
        link: link
    };
});

/** (taken from https://github.com/krescruz/angular-materialize)
 * Instead of adding the .input-field class to a div surrounding a label and input, add the attribute input-field.
 * That way it will also work when angular destroys/recreates the elements.
 *
 * Example:
 <inputfield style="margin-top:10px">
 <label>{{name}}:</label>
 <input type="text" name="{{name}}" ng-model="value">
 </inputfield>
 */
angular.module("ui.materialize.inputfield", [])
    .directive('inputField', ["$compile", "$timeout", function ($compile, $timeout) {
        return {
            transclude: true,
            scope: {},
            link: function (scope, element) {
                $timeout(function () {
                    Materialize.updateTextFields();

                    element.find('textarea, input').each(function (index, countable) {
                        countable = angular.element(countable);
                        if (!countable.siblings('span[class="character-counter"]').length) {
                            countable.characterCounter();
                        }
                    });
                });
            },
            template: '<div ng-transclude class="input-field"></div>'
        };
    }]);

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

var app = angular.module('juke');

var getHubs = function(HubModel){
    return HubModel.getHubs();
};
getHubs.$inject = ["HubModel"];

var getHubById = function(HubModel, $stateParams){
    var hubId = $stateParams.hubId;
    return HubModel.getHubById(hubId);
};
getHubById.$inject = ["HubModel", "$stateParams"];


app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
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
}]);


app.config(["$provide", function($provide) {
    $provide.decorator('$state', ["$delegate", "$rootScope", function($delegate, $rootScope) {
        $rootScope.$on('$stateChangeStart', function(event, state, params) {
            $delegate.next = state;
            $delegate.toParams = params;
        });
        return $delegate;
    }]);
}]);


app.config(["$provide", function($provide) {
  $provide.decorator('$state', ["$delegate", "$rootScope", function($delegate, $rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, state, params) {
      $delegate.next = state;
      $delegate.toParams = params;
    });
    return $delegate;
  }]);
}]);

'use strict';

namespace('models.events').HUB_UPDATED = "ActivityModel.HUB_UPDATED";
namespace('models.events').HUBS_UPDATED = "ActivityModel.HUBS_UPDATED";

var HubModel = EventDispatcher.extend({
    hub: null,
    hubs : [],
    ParseService:null,
    notifications: null,
    currentSong: null,

    getHubs: function(){
        return this.ParseService.getHubs().then(function(hubs){
            this.hubs = hubs;
            return hubs;
        }.bind(this), function(error){
            return error;
        });
    },

    getHubById: function(hubId){
        return this.ParseService.getHubById(hubId).then(function(hub){
            this.hub = hub;
            return hub;
        }.bind(this), function(error){
            return error;
        });
    },

    createHub: function(hub){
        return this.ParseService.createHub(hub).then(function(hub){
            this.hub = hub;
            return hub;
        }.bind(this), function(error){
            return error;
        });
    },

    addSongToPlaylist: function(song){
        return this.ParseService.addSongToPlaylist(song, this.hub).then(function(result){
            console.log(result);

        }.bind(this));
    },

    getPlaylist: function(){

    },

});


(function (){
    var HubModelProvider = Class.extend({
        instance: new HubModel(),

        $get: ["ParseService", "Notifications", function(ParseService, Notifications){
            this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
            return this.instance;
        }]
    });

    angular.module('HubModel',[])
        .provider('HubModel', HubModelProvider);
}());

'use strict';

namespace('models.events').SONG_ADDED = "ActivityModel.SONG_ADDED";
namespace('models.events').SONGS_FOUND = "ActivityModel.SONG_FOUND";


var SongModel = EventDispatcher.extend({
    song: null,
    songs: [],
    playingSong: null,
    nextSong: null,
    queuedSongs: [],
    foundSongs: [],
    ParseService:null,
    notifications: null,

    getNextSong: function(hubId){
        return this.ParseService.getNextSong(hubId).then(function(song){
            this.nextSong = song;
            return song;
        }.bind(this), function(error){
            return error;
        });
    },

    findSongs: function(searchParams){
        return this.findYouTubeSongs(searchParams);
    },

    findYouTubeSongs: function(searchParams){
        var deferred = this.$q.defer();
        var request = gapi.client.youtube.search.list({
            q: searchParams.text,
            maxResults: 10,
            part: 'snippet'
        });

        request.execute(function(response) {
            this.parseYouTubeSongs(response.items);
            this.notifications.notify(models.events.SONGS_FOUND);
            deferred.resolve(response);
        }.bind(this), function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    },

    parseYouTubeSongs: function(songs){
        songs.forEach(function(song){
            this.foundSongs.push({
                type: "youtube",
                title: song.snippet.title,
                description: song.snippet.description,
                thumbnail: song.snippet.thumbnails.default.url,
                youtubeId: song.id.videoId,
                createdAt: song.snippet.publishedAt
            });
        }.bind(this));
    }

});


(function (){
    var SongModelProvider = Class.extend({
        instance: new SongModel(),

        $get: ["$q", "ParseService", "Notifications", function($q, ParseService, Notifications){
            this.instance.$q = $q;
            this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
            return this.instance;
        }]
    });

    angular.module('SongModel',[])
        .provider('SongModel', SongModelProvider);
}());

'use strict';

namespace('models.events').USER_SIGNED_IN = "ActivityModel.USER_SIGNED_IN";
namespace('models.events').USER_SIGNED_OUT = "ActivityModel.USER_SIGNED_OUT";
namespace('models.events').USER_UPDATED = "ActivityModel.USER_UPDATED";

namespace('models.events').USERS_FETCHED = "ActivityModel.USERS_FETCHED";

namespace('models.events').PROFILE_LOADED = "ActivityModel.PROFILE_LOADED";
namespace('models.events').AUTH_ERROR = "ActivityModel.AUTH_ERROR";
namespace('models.events').NETWORK_ERROR = "ActivityModel.NETWORK_ERROR";

var UserModel = EventDispatcher.extend({
    currentUser: null,
    users: null,
    ParseService:null,
    notifications: null,

    login: function(username, password){
        return this.ParseService.login(username, password).then(function(user){
            this.currentUser = user;
            this.notifications.notify(models.events.USER_SIGNED_IN);
            return user;
        }.bind(this), function(error){
            return error;
        }.bind(this));
    },

    signUp: function(username, password){
        return this.ParseService.signUp(username, password).then(function(user){
            this.currentUser = user;
            this.notifications.notify(models.events.USER_SIGNED_IN);
            return user;
        }.bind(this), function(error){
            return error;
        }.bind(this));
    },

    signOut: function(){
        return this.ParseService.signOut().then(function(){
            this.notifications.notify(models.events.USER_SIGNED_OUT);
        });
    },

    updateUser: function(user){

    },

    getUsers: function(){
        return this.ParseService.getUsers().then(function(results){
            this.users = results;
            this.notifications.notify(models.events.USERS_FETCHED);
            return Parse.Promise.as(results);
        }.bind(this));
    },

    getUserById: function(id){
        return this.ParseService.getUserById(id).then(function(results){
            this.profile = results;
            this.notifications.notify(models.events.PROFILE_LOADED);
            return Parse.Promise.as(results);
        }.bind(this));
    },

    getUsersForGym:function(gym){
        return this.ParseService.getUsersForGym(gym).then(function(results){
            this.users = results;
            this.notifications.notify(models.events.USERS_FETCHED);
            return Parse.Promise.as(results);
        }.bind(this));
    },

    getUsersAndStatsForGym:function(gym){
        return this.ParseService.getUsersAndStatsForGym(gym).then(function(results){
            this.users = results;
            this.notifications.notify(models.events.USERS_FETCHED);
            return Parse.Promise.as(results);
        }.bind(this));
    },

    getNewUser: function(){
        var user = new Parse.User();

        return user;
    },

    createUser: function(user){
        return this.ParseService.createUser(user);
    },

    updateUser: function(user){
        return Parse.Cloud.run('updateUser',{
            userId: user.id,
            gymId: user.attributes.currentGym.id,
            email: user.attributes.email,
            setter: user.attributes.setter,
            username: user.attributes.username
        });
    },

    getSetters: function(){
        return this.ParseService.getSetters().then(function(results){
            this.setters = results;
            return Parse.Promise.as(results);
        }.bind(this));
    }

});


(function (){
    var UserModelProvider = Class.extend({
        instance: new UserModel(),

        $get: ["ParseService", "Notifications", function(ParseService, Notifications){
            this.instance.ParseService = ParseService;
            this.instance.notifications = Notifications;
            this.instance.currentUser = Parse.User.current();
            return this.instance;
        }]
    });

    angular.module('UserModel',[])
        .provider('UserModel', UserModelProvider);
}());

'use strict';

var ParseService = Class.extend({

    Hub: Parse.Object.extend("Hub"),
    Song: Parse.Object.extend("Song"),
    QueuedSong: Parse.Object.extend("QueuedSong"),
    HubACL: new Parse.ACL(),
    SongACL: new Parse.ACL(),
    QueuedSongACL: new Parse.ACL(),

    /**** util ****/
    genRandomPass:function(){
        var string = 'password';
        for(var i=0;i<10;i++){
            string = string+(Math.floor(Math.random() * 9) + 1).toString();
        }
        return string;
    },

    /**** Users ****/
    login: function(username, password){
        return Parse.User.logIn(username, password, {
            success: function(user) {
                return user;
            },
            error: function(user, error) {
                console.log(error);
                return error;
            }
        });
    },

    signOut: function(){
        return Parse.User.logOut();
    },

    signUp: function(username, password){
        return Parse.User.signUp(username, password, {
            success: function(user) {
                return user;
            },
            error: function(user, error) {
                console.log(error);
                return error;
            }
        });
    },

    //CREATE
    createUser: function(user){
        return Parse.Cloud.run('createUser',user);
    },

    //UPDATE
    updateUser: function(user){

    },

    //READ
    getCurrentUser: function(){
        return Parse.User.current();
    },

    //READ
    getUsers: function(){
        var query = new Parse.Query(Parse.User);
        return query.find();
    },

    //READ
    getUserById: function(id){
        var query = new Parse.Query("User");
        query.include('currentGym');
        return query.get(id);
    },

    //DELETE
    deletUser: function(userId){
        return Parse.Cloud.run('deleteUser', userId);
    },

    /** Hubs **/

    //CREATE
    createHub: function(hub){
        var newHub = new this.Hub();
        newHub.set("name", hub.name);
        newHub.set("password", hub.password);
        newHub.set("type", "web");
        newHub.set("owner", Parse.User.current());
        return newHub.save(null, {
            success: function(newHub){
                return newHub;
            }, error: function(newHub, error){
                return error;
            }
        });
    },

    //UPDATE
    updateHub: function(){

    },

    //READ
    getHubs: function(){
        var query = new Parse.Query("Hub");
        query.include("owner");
        return query.find({
            success: function(hubs){
                return hubs;
            }, error: function(error){
                return error;
            }
        });
    },

    //READ
    getHubById: function(id){
        var query = new Parse.Query("Hub");
        query.include("owner");
        return query.get(id, {
            success: function(hub){
                return hub;
            }, error: function(hub, error){
                return error;
            }
        });
    },

    //DELETE
    deleteHub: function(hubId){
        return Parse.Cloud.run('deleteHub', {hubId: hubId, userId: Parse.User.current().id});
    },

    /** SONGS **/

    //Add Song
    addSongToPlaylist: function(song, hub){
        var deferred = this.$q.defer();
        var queuedSong = new this.QueuedSong();
        queuedSong.set("addedBy", Parse.User.current());
        queuedSong.set("hub", hub);
        queuedSong.set("title", song.title);
        queuedSong.set("thumbnail", song.thumbnail);
        queuedSong.set("description", song.description);
        queuedSong.set("type", song.type);
        queuedSong.set("youtubeId", song.youtubeId);
        queuedSong.set("songCreatedAt", song.createdAt);

        queuedSong.save(null, {
            success: function(result){
                deferred.resolve(result);
            }, error: function(error){
                deferred.reject(error);
            }
        });

        return deferred.promise;

        //For Song analytics
        /*
        var query = new Parse.Query("Song");
        if(song.type == 'youtube'){
            query.equalTo("type", "youtube");
            query.equalTo("youtubeId", song.youtubeId);
        } else {
            console.log("error, don't know type of song");
        }

        query.first({
            success: function(result){
                if(result.id){
                    result.set("playCount", result.get("addCount") + 1);
                } else {
                    //create new Song
                }
            }, error: function(error){
                deferred.reject(error);
            }
        });
         */


        //Needs to be in the cloud eventually
        //return Parse.Cloud.run('addSongToPlaylist', {song: JSON.stringify(song), hub: hub.toJSON(), userId: Parse.User.current().id });
    }

});

(function(){
    var ParseServiceProvider = Class.extend({
        instance:new ParseService(),
        $get: ["$q", function($q){

            Parse.initialize("GU8DuOP6RzlnFFNBNOVnB5qrf6HCqxpJXSbDyN3W", "Wf6t36hyN7aPbkQzIxN6bXPMZGlr4xpdZgK1ljwG");
            this.instance.$q = $q;
            this.instance.HubACL.setPublicReadAccess(true);
            this.instance.HubACL.setPublicWriteAccess(false);
            this.instance.SongACL.setPublicReadAccess(true);
            this.instance.SongACL.setPublicWriteAccess(false);
            this.instance.QueuedSongACL.setPublicReadAccess(true);
            this.instance.QueuedSongACL.setPublicWriteAccess(false);

            return this.instance;
        }]
    });

    angular.module('ParseService',[])
        .provider('ParseService', ParseServiceProvider);
})();

'use strict';

namespace('models.events').BRAND_CHANGE = "ActivityModel.BRAND_CHANGE";

var NavBarDirective = BaseDirective.extend({
    userModel: null,
    notifications: null,

    initialize: function($scope, $rootScope, $state, $timeout, UserModel, Notifications, HubModel){
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$timeout = $timeout;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this.notifications.addEventListener(models.events.USER_SIGNED_IN, this.onUserSignedIn.bind(this));
        this.notifications.addEventListener(models.events.USER_SIGNED_OUT, this.onUserSignedOut.bind(this));
        this.notifications.addEventListener(models.events.BRAND_CHANGE, this.onBrandChange.bind(this));

    },

    defineScope: function(){
        this.$scope.currentUser = this.userModel.currentUser;
        this.$scope.signOut = this.signOut.bind(this);
        this.$scope.openAddHubModal = this.openAddHubModal.bind(this);
        this.$scope.openLoginModal = this.openLoginModal.bind(this);

        $(".userDropdownButton").dropdown();
        $(".button-collapse").sideNav();
    },

    openAddHubModal: function(){
        this.notifications.notify(models.events.OPEN_ADD_HUB_MODAL);
    },

    openLoginModal: function(){
        this.notifications.notify(models.events.OPEN_LOGIN_MODAL);
    },

    signOut: function(){
        this.notifications.notify(models.events.SHOW_LOADING);
        this.userModel.signOut().then(function(){
            this.notifications.notify(models.events.HIDE_LOADING);
        });
    },

    onUserSignedIn: function(){
        this.$scope.currentUser = this.userModel.currentUser;
        $(".dropdown-button").dropdown();
    },

    onUserSignedOut: function(){
        this.$scope.currentUser = this.userModel.currentUser;
    },


    onBrandChange: function(event, brand){
        this.$scope.brand = brand;
    }

});

angular.module('navbar',[])
    .directive('navbar', ["$rootScope", "$state", "$timeout", "UserModel", "Notifications", "HubModel", function($rootScope, $state, $timeout, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            isolate:true,
            link: function($scope){
                new NavBarDirective($scope, $rootScope, $state, $timeout, UserModel, Notifications, HubModel);
            },
            scope:true,
            templateUrl: "partials/navbar/navbar.html"
        };
    }]);

'use strict';
namespace('models.events').SHOW_LOADING = "ActivityModel.SHOW_LOADING";
namespace('models.events').HIDE_LOADING = "ActivityModel.HIDE_LOADING";

var OverlayDirective = BaseDirective.extend({
    notifications: null,

    init: function($scope, $rootScope, Notifications){
        this.$rootScope = $rootScope;
        this.notifications = Notifications;
        this._super($scope);
    },

    defineListeners: function(){
        this.notifications.addEventListener(models.events.SHOW_LOADING, this.handleShowLoading.bind(this));
        this.notifications.addEventListener(models.events.HIDE_LOADING, this.handleHideLoading.bind(this));

        this.$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            this.$scope.loading = true;
        }.bind(this));

    },

    defineScope: function(){
        this.$scope.loading = true;
    },

    /** EVENT HANDLERS **/
    handleShowLoading: function(event){
        this.$scope.loading = true;
        if(!this.$scope.$$phase) {
            this.$scope.$apply();
        }
    },

    handleHideLoading: function(event){
        this.$scope.loading = false;
        if(!this.$scope.$$phase) {
            this.$scope.$apply();
        }
    }
});

angular.module('overlay',[])
    .directive('overlay', ["$rootScope", "Notifications", function($rootScope, Notifications){
	return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope){
		new OverlayDirective($scope, $rootScope, Notifications);
	    },
	    scope:true,
            templateUrl: "partials/overlay/overlay.html"
	};
    }]);

'use strict';
namespace('models.events').PLAYING = "ActivityModel.PLAYING";
namespace('models.events').STOPPED = "ActivityModel.STOPPED";
namespace('models.events').NEXT_SONG = "ActivityModel.NEXT_SONG";
namespace('models.events').SONGS_LOADED = "ActivityModel.SONGS_LOADED";

var PlayerDirective = BaseDirective.extend({
    notifications: null,

    init: function($scope, $rootScope, Notifications){
        this.$rootScope = $rootScope;
        this.notifications = Notifications;
        this._super($scope);
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
        console.log("hi");
    },

    destroy: function(){
        this._super();
    },

});

angular.module('player',[])
    .directive('player', ["$rootScope", "Notifications", function($rootScope, Notifications){
	return {
	    restrict:'E',
	    isolate:true,
	    link: function($scope){
		new PlayerDirective($scope, $rootScope, Notifications);
	    },
	    scope:true,
            templateUrl: "partials/player/player.html"
	};
    }]);

'use strict';

var PlaylistDirective = BaseDirective.extend({
    hubModel: null,
    songModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel, SongModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
        this.songModel = SongModel;
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
        this.$scope.hub = this.hubModel.hub;
        this.$scope.currentSong = {};
    },

    destroy: function(){
        this._super();

    },



});

angular.module('playlist',[])
    .directive('playlist', ["$state", "UserModel", "Notifications", "HubModel", "SongModel", function($state, UserModel, Notifications, HubModel, SongModel){
        return {
            restrict:'E',
            link: function($scope){
                new PlaylistDirective($scope, $state, UserModel, Notifications, HubModel, SongModel);
            },
            scope: true,
            templateUrl: "partials/playlist/playlist.html"
        };
    }]);

'use strict';

var PlaylistItemDirective = BaseDirective.extend({
    hubModel: null,
    songModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();

    },

    destroy: function(){
        this._super();
    },


});

angular.module('playlistItem',[])
    .directive('playlistItem', ["$state", "UserModel", "Notifications", "HubModel", function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new PlaylistItemDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/playlist/playlistItem.html"
        };
    }]);

'use strict';

namespace('models.events').OPEN_ADD_HUB_MODAL = "ActivityModel.OPEN_ADD_HUB_MODAL";

var AddHubModalDirective = BaseDirective.extend({
    hubModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this._super();
        this.onOpenModal = this.onOpenModal.bind(this);
        this.notifications.addEventListener(models.events.OPEN_ADD_HUB_MODAL, this.onOpenModal);
    },

    defineScope: function(){
        this._super();
        this.$scope.createHub = this.createHub.bind(this);
        this.$scope.hub = {};
    },

    destroy: function(){
        this._super();
        this.notifications.removeEventListener(models.events.OPEN_ADD_HUB_MODAL, this.onOpenModal);
    },

    onOpenModal: function(){
        $('#addHubModal').openModal();
    },

    createHub: function(){
        console.log("createHub");
        console.log(this.$scope.hub);
        this.notifications.notify(models.events.SHOW_LOADING);
        this.hubModel.createHub(this.$scope.hub).then(function(hub){
            this.notifications.notify(models.events.HIDE_LOADING);
            console.log(hub);
            this.$state.go('hub', {hubId: hub.id});
        }.bind(this), function(error){
            console.log(error);
        });

    }

});

angular.module('addHubModal',[])
    .directive('addHubModal', ["$state", "UserModel", "Notifications", "HubModel", function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new AddHubModalDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/hubs/addHubModal/addHubModal.html"
        };
    }]);

'use strict';

var HubInfoDirective = BaseDirective.extend({
    hubModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
        this.currentUser = this.userModel.currentUser;
        this.hub = this.hubModel.hub;
    },

    destroy: function(){
        this._super();
    }


});

angular.module('hubInfo',[])
    .directive('hubInfo', ["$state", "UserModel", "Notifications", "HubModel", function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new HubInfoDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/hubs/hubInfo/hubInfo.html"
        };
    }]);

var HubPageController = BaseController.extend({

    initialize:function($scope, $state, Notifications, UserModel, HubModel){
        this.userModel = UserModel;
        this.hubModel = HubModel;
        this.$state = $state;
        this.notifications = Notifications;
    },

    defineListeners:function(){
        this._super();
    },

    defineScope:function(){
        this._super();
        this.$scope.hub = this.hubModel.hub;
        this.$scope.currentUser = this.userModel.currentUser;
        this.$scope.openAddSongModal = this.openAddSongModal.bind(this);

        $(document).ready(function(){
            $('ul.tabs').tabs();
        });

        this.notifications.notify(models.events.BRAND_CHANGE, this.$scope.hub.get('name'));
        this.notifications.notify(models.events.HIDE_LOADING);
    },

    destroy:function(){
        this._super();
    },

    openAddSongModal: function(){
        this.notifications.notify(models.events.OPEN_ADD_SONG_MODAL);
    }



});

HubPageController.$inject = ['$scope', '$state', 'Notifications', 'UserModel', 'HubModel'];

'use strict';

var HubListDirective = BaseDirective.extend({
    hubModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this._super();

    },

    defineScope: function(){
        this._super();
        this.$scope.hubs = this.hubModel.hubs;
        console.log(this.$scope.hubs);
    },

    destroy: function(){
        this._super();
    },


});

angular.module('hubList',[])
    .directive('hubList', ["$state", "UserModel", "Notifications", "HubModel", function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new HubListDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope: false,
            templateUrl: "partials/hubs/hubList/hubList.html"
        };
    }]);

'use strict';

var HubListItemDirective = BaseDirective.extend({
    hubModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
    },

    destroy: function(){
        this._super();
    },


});

angular.module('hubListItem',[])
    .directive('hubListItem', ["$state", "UserModel", "Notifications", "HubModel", function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new HubListItemDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/hubs/hubList/hubListItem.html"
        };
    }]);

//Users Controller
var HubsPageController = BaseController.extend({

    initialize:function($scope, $state, Notifications, UserModel, HubModel){
        this.userModel = UserModel;
        this.hubModel = HubModel;
        this.$state = $state;
        this.notifications = Notifications;
    },

    defineListeners:function(){
        this._super();
    },

    defineScope:function(){
        this._super();
        this.$scope.currentUser = this.userModel.currentUser;
        this.$scope.openAddHubModal = this.openAddHubModal.bind(this);

        this.notifications.notify(models.events.BRAND_CHANGE, "Hubs");
        this.notifications.notify(models.events.HIDE_LOADING);
    },

    destroy:function(){
        this._super();
    },

    openAddHubModal: function(){
        this.notifications.notify(models.events.OPEN_ADD_HUB_MODAL);
    }
});

HubsPageController.$inject = ['$scope', '$state', 'Notifications', 'UserModel', 'HubModel'];

'use strict';
namespace('models.events').PLAY = "ActivityModel.PLAY";
namespace('models.events').STOP = "ActivityModel.STOP";
namespace('models.events').NEXT_SONG = "ActivityModel.NEXT_SONG";
namespace('models.events').SONGS_LOADED = "ActivityModel.SONGS_LOADED";

var YouTubePlayerDirective = BaseDirective.extend({
    notifications: null,
    hubModel: null,
    player: null,
    state: null,


    init: function($scope, $rootScope, Notifications){
        this.$rootScope = $rootScope;
        this.notifications = Notifications;
        this._super($scope);
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
        this.initYouTubePlayer();
    },

    destroy: function(){
        this._super();
    },

    initYouTubePlayer: function(){
        this.player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: 'M7lc1UVf-VE',
            events: {
                'onReady': this.onPlayerReady,
                'onStateChange': this.onPlayerStateChange.bind(this)
            }
        });
    },

    onPlayerReady: function(event){
        event.target.playVideo();
    },

    onPlayerStateChange: function(event){
        this.player.stopVideo();
    }

});

angular.module('youtubePlayer',[])
    .directive('youtubePlayer', ["$rootScope", "Notifications", function($rootScope, Notifications){
	return {
	    restrict:'E',
	    link: function($scope){
		new YouTubePlayerDirective($scope, $rootScope, Notifications);
	    },
	    scope:false,
            templateUrl: "partials/player/modules/youtubePlayer.html"
	};
    }]);

'use strict';

namespace('models.events').OPEN_ADD_SONG_MODAL = "ActivityModel.OPEN_ADD_SONG_MODAL";

var AddSongModalDirective = BaseDirective.extend({
    hubModel: null,
    songModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel, SongModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
        this.songModel = SongModel;
    },

    defineListeners: function(){
        this._super();
        this.onOpenModal = this.onOpenModal.bind(this);
        this.notifications.addEventListener(models.events.OPEN_ADD_SONG_MODAL, this.onOpenModal);
    },

    defineScope: function(){
        this._super();
        this.$scope.findSongs = this.findSongs.bind(this);
        this.$scope.searchParams = {};
    },

    destroy: function(){
        this._super();
        this.notifications.removeEventListener(models.events.OPEN_ADD_SONG_MODAL, this.onOpenModal);
    },

    onOpenModal: function(){
        $('#addSongModal').openModal();
        $('#queryInput').focus();
    },

    findSongs: function(){
        this.songModel.findSongs(this.$scope.searchParams).then(function(results){

        });
    }


});

angular.module('addSongModal',[])
    .directive('addSongModal', ["$state", "UserModel", "Notifications", "HubModel", "SongModel", function($state, UserModel, Notifications, HubModel, SongModel){
        return {
            restrict:'E',
            link: function($scope){
                new AddSongModalDirective($scope, $state, UserModel, Notifications, HubModel, SongModel);
            },
            scope: true,
            templateUrl: "partials/songs/addSongModal/addSongModal.html"
        };
    }]);

'use strict';

var SongListDirective = BaseDirective.extend({
    hubModel: null,
    songModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel, SongModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
        this.songModel = SongModel;
    },

    defineListeners: function(){
        this._super();
        this.onSongsFound = this.onSongsFound.bind(this);
        this.notifications.addEventListener(models.events.SONGS_FOUND, this.onSongsFound);
    },

    defineScope: function(){
        this._super();
        this.$scope.hub = this.hubModel.hub;
        this.$scope.youtubeSongs = this.songModel.foundYoutubeSongs;
    },

    destroy: function(){
        this._super();
        this.notifications.removeEventListener(models.events.SONGS_FOUND, this.onSongsFound);
    },

    onSongsFound: function(){
        this.$scope.songs = this.songModel.foundSongs;
        console.log(this.$scope.songs);
    }


});

angular.module('songList',[])
    .directive('songList', ["$state", "UserModel", "Notifications", "HubModel", "SongModel", function($state, UserModel, Notifications, HubModel, SongModel){
        return {
            restrict:'E',
            link: function($scope){
                new SongListDirective($scope, $state, UserModel, Notifications, HubModel, SongModel);
            },
            scope: true,
            templateUrl: "partials/songs/songList/songList.html"
        };
    }]);

'use strict';

var SongListItemDirective = BaseDirective.extend({
    hubModel: null,
    songModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
        this.$scope.addSong = this.addSong.bind(this);
        //console.log(this.$scope.song);
    },

    destroy: function(){
        this._super();
    },

    addSong: function(){
        console.log("add");
        this.notifications.notify(models.events.SHOW_LOADING);
        this.hubModel.addSongToPlaylist(this.$scope.song).then(function(results){
            this.notifications.notify(models.events.HIDE_LOADING);
            Materialize.toast('Song added!', 2000, '');
        }.bind(this));
    }

});

angular.module('songListItem',[])
    .directive('songListItem', ["$state", "UserModel", "Notifications", "HubModel", function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new SongListItemDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/songs/songList/songListItem.html"
        };
    }]);

'use strict';

namespace('models.events').OPEN_LOGIN_MODAL = "ActivityModel.OPEN_LOGIN_MODAL";

var LoginModalDirective = BaseDirective.extend({
    userModal: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
    },

    defineListeners: function(){
        this._super();
        this.onOpenModal = this.onOpenModal.bind(this);
        this.notifications.addEventListener(models.events.OPEN_LOGIN_MODAL, this.onOpenModal);
    },

    defineScope: function(){
        this._super();
        this.$scope.login = this.login.bind(this);
        this.$scope.signUp = this.signUp.bind(this);
        this.$scope.user = {};
        this.$scope.isLogin = true;
    },

    onOpenModal: function(){
        $('#loginModal').openModal();
    },

    login: function(){
        this.notifications.notify(models.events.SHOW_LOADING);
        this.userModel.login(this.$scope.user.username, this.$scope.user.password).then(function(user){
            this.notifications.notify(models.events.HIDE_LOADING);
            $('#loginModal').closeModal();
        }.bind(this), function(error){
            this.notifications.notify(models.events.HIDE_LOADING);
            console.log(error);
            this.$scope.error = true;
            this.$scope.errorMessage = error.message;
            this.$scope.$apply();
        }.bind(this));
    },

    signUp: function(){
        this.notifications.notify(models.events.SHOW_LOADING);
        console.log(this.$scope.user);
        this.userModel.signUp(this.$scope.user.username, this.$scope.user.password).then(function(user){
            this.notifications.notify(models.events.HIDE_LOADING);
            $('#loginModal').closeModal();
        }.bind(this), function(error){
            this.notifications.notify(models.events.HIDE_LOADING);
            console.log(error);
            this.$scope.error = true;
            this.$scope.errorMessage = error.message;
            this.$scope.$apply();
        }.bind(this));
    }


});

angular.module('loginModal',[])
    .directive('loginModal', ["$state", "UserModel", "Notifications", function($state, UserModel, Notifications){
        return {
            restrict:'E',
            link: function($scope){
                new LoginModalDirective($scope, $state, UserModel, Notifications);
            },
            scope:false,
            templateUrl: "partials/users/loginModal/loginModal.html"
        };
    }]);

'use strict';

var UserListDirective = BaseDirective.extend({
    hubModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this._super();

    },

    defineScope: function(){
        this._super();
        this.$scope.hubs = this.hubModel.hubs;
    },

    destroy: function(){
        this._super();
    },


});

angular.module('userList',[])
    .directive('userList', ["$state", "UserModel", "Notifications", "HubModel", function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new UserListDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope: false,
            templateUrl: "partials/users/userList/userList.html"
        };
    }]);

'use strict';

var UserListItemDirective = BaseDirective.extend({
    hubModel: null,
    userModel: null,
    notifications: null,

    initialize: function($scope, $state, UserModel, Notifications, HubModel){
        this.$state = $state;
        this.userModel = UserModel;
        this.notifications = Notifications;
        this.hubModel = HubModel;
    },

    defineListeners: function(){
        this._super();
    },

    defineScope: function(){
        this._super();
    },

    destroy: function(){
        this._super();
    },


});

angular.module('userListItem',[])
    .directive('userListItem', ["$state", "UserModel", "Notifications", "HubModel", function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new UserListItemDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/users/userList/userListItem.html"
        };
    }]);

var UserPageController = BaseController.extend({

    initialize:function($scope, $state, Notifications, UserModel, HubModel){
        this.userModel = UserModel;
        this.hubModel = HubModel;
        this.$state = $state;
        this.notifications = Notifications;
    },

    defineListeners:function(){
        this._super();
    },

    defineScope:function(){
        this._super();
        this.notifications.notify(models.events.BRAND_CHANGE, "Users");
        this.$scope.user = this.userModel.user;
        this.notifications.notify(models.events.HIDE_LOADING);
    },

    destroy:function(){
        this._super();
    }
});

UserPageController.$inject = ['$scope', '$state', 'Notifications', 'UserModel', 'HubModel'];

var UsersPageController = BaseController.extend({

    initialize:function($scope, $state, Notifications, UserModel, HubModel){
        this.userModel = UserModel;
        this.hubModel = HubModel;
        this.$state = $state;
        this.notifications = Notifications;
    },

    defineListeners:function(){
        this._super();
    },

    defineScope:function(){
        this._super();
        this.notifications.notify(models.events.BRAND_CHANGE, "Users");
        this.$scope.users = this.userModel.users;
        this.notifications.notify(models.events.HIDE_LOADING);
    },

    destroy:function(){
        this._super();
    }
});

UsersPageController.$inject = ['$scope', '$state', 'Notifications', 'UserModel', 'HubModel'];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsYXNzLmpzIiwiQmFzZUNvbnRyb2xsZXIuanMiLCJCYXNlRGlyZWN0aXZlLmpzIiwiRXZlbnREaXNwYXRjaGVyLmpzIiwiR29vZ2xlQ2hhcnRzLmpzIiwiTmFtZXNwYWNlLmpzIiwiTm90aWZpY2F0aW9ucy5qcyIsImN1c3RvbU1vZHVsZS5qcyIsImpxLmpzIiwibWF0U2VsZWN0LmpzIiwiYXBwLmpzIiwiY29uZmlnLmpzIiwibW9kZWxzL2h1Yk1vZGVsLmpzIiwibW9kZWxzL3NvbmdNb2RlbC5qcyIsIm1vZGVscy91c2VyTW9kZWwuanMiLCJzZXJ2aWNlcy9wYXJzZVNlcnZpY2UuanMiLCJjb21wb25lbnRzL25hdmJhci9uYXZiYXJEaXJlY3RpdmUuanMiLCJjb21wb25lbnRzL292ZXJsYXkvb3ZlcmxheURpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvcGxheWVyL3BsYXllckRpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvcGxheWxpc3QvcGxheWxpc3REaXJlY3RpdmUuanMiLCJjb21wb25lbnRzL3BsYXlsaXN0L3BsYXlsaXN0SXRlbURpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvaHVicy9hZGRIdWJNb2RhbC9hZGRIdWJNb2RhbC5qcyIsImNvbXBvbmVudHMvaHVicy9odWJJbmZvL2h1YkluZm9EaXJlY3RpdmUuanMiLCJjb21wb25lbnRzL2h1YnMvaHViUGFnZS9odWJQYWdlQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvaHVicy9odWJzTGlzdC9odWJMaXN0RGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9odWJzL2h1YnNMaXN0L2h1Ykxpc3RJdGVtRGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9odWJzL2h1YnNQYWdlL2h1YnNQYWdlQ29udHJvbGxlci5qcyIsImNvbXBvbmVudHMvcGxheWVyL21vZHVsZXMveW91dHViZVBsYXllckRpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvc29uZ3MvYWRkU29uZ01vZGFsL2FkZFNvbmdNb2RhbERpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvc29uZ3Mvc29uZ0xpc3Qvc29uZ0xpc3REaXJlY3RpdmUuanMiLCJjb21wb25lbnRzL3NvbmdzL3NvbmdMaXN0L3NvbmdMaXN0SXRlbURpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvdXNlcnMvbG9naW5Nb2RhbC9sb2dpbk1vZGFsLmpzIiwiY29tcG9uZW50cy91c2Vycy91c2VyTGlzdC91c2VyTGlzdERpcmVjdGl2ZS5qcyIsImNvbXBvbmVudHMvdXNlcnMvdXNlckxpc3QvdXNlckxpc3RJdGVtRGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy91c2Vycy91c2VyUGFnZS91c2VyUGFnZUNvbnRyb2xsZXIuanMiLCJjb21wb25lbnRzL3VzZXJzL3VzZXJzUGFnZS91c2Vyc1BhZ2VDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLENBQUEsU0FBQSxRQUFBO0VBQ0E7RUFDQSxJQUFBLFNBQUEsTUFBQSxLQUFBLFVBQUEsQ0FBQSxTQUFBLGVBQUE7OztFQUdBLFNBQUEsV0FBQTs7O0VBR0EsVUFBQSxTQUFBLFNBQUEsT0FBQTtJQUNBLElBQUEsU0FBQSxLQUFBOzs7O0lBSUEsSUFBQSxRQUFBLE9BQUEsT0FBQTs7O0lBR0EsS0FBQSxJQUFBLFFBQUEsT0FBQTs7TUFFQSxNQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUE7UUFDQSxPQUFBLE9BQUEsU0FBQSxjQUFBLE9BQUEsS0FBQSxNQUFBO1VBQ0EsQ0FBQSxTQUFBLE1BQUEsR0FBQTtZQUNBLE9BQUEsV0FBQTtjQUNBLElBQUEsTUFBQSxLQUFBOzs7O2NBSUEsS0FBQSxTQUFBLE9BQUE7Ozs7Y0FJQSxJQUFBLE1BQUEsR0FBQSxNQUFBLE1BQUE7Y0FDQSxLQUFBLFNBQUE7O2NBRUEsT0FBQTs7YUFFQSxNQUFBLE1BQUE7VUFDQSxNQUFBOzs7O0lBSUEsSUFBQSxXQUFBLE9BQUEsTUFBQSxTQUFBO1FBQ0EsTUFBQSxlQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUEsVUFBQSxFQUFBLE9BQUEsS0FBQSxNQUFBLE1BQUE7UUFDQSxTQUFBLFlBQUE7OztJQUdBLFNBQUEsWUFBQTs7O0lBR0EsTUFBQSxjQUFBOzs7SUFHQSxTQUFBLFNBQUEsVUFBQTs7SUFFQSxPQUFBOzs7O0VBSUEsT0FBQSxRQUFBO0dBQ0E7O0FDNURBLElBQUEsaUJBQUEsTUFBQSxPQUFBO0VBQ0EsT0FBQTs7RUFFQSxLQUFBLFNBQUEsTUFBQTs7SUFFQSxLQUFBLFNBQUE7OztJQUdBLEtBQUEsV0FBQSxNQUFBLEtBQUE7OztJQUdBLEtBQUEsT0FBQSxJQUFBLFdBQUEsS0FBQSxRQUFBLEtBQUE7OztJQUdBLEtBQUE7OztJQUdBLEtBQUE7OztFQUdBLFdBQUEsVUFBQTs7OztFQUlBLGlCQUFBLFVBQUE7Ozs7RUFJQSxhQUFBLFVBQUE7Ozs7RUFJQSxRQUFBLFNBQUEsTUFBQTs7Ozs7QUFLQSxlQUFBLFVBQUEsQ0FBQTs7QUNyQ0EsSUFBQSxnQkFBQSxNQUFBLE9BQUE7RUFDQSxPQUFBOztFQUVBLEtBQUEsU0FBQSxNQUFBOztJQUVBLEtBQUEsU0FBQTs7O0lBR0EsS0FBQSxXQUFBLE1BQUEsS0FBQTs7O0lBR0EsS0FBQSxPQUFBLElBQUEsV0FBQSxLQUFBLFFBQUEsS0FBQTs7O0lBR0EsS0FBQTs7O0lBR0EsS0FBQTs7O0VBR0EsV0FBQSxVQUFBOzs7O0VBSUEsaUJBQUEsVUFBQTs7OztFQUlBLGFBQUEsVUFBQTs7OztFQUlBLFFBQUEsU0FBQSxNQUFBOzs7OztBQUtBLGNBQUEsVUFBQSxDQUFBOzs7Ozs7Ozs7OztBQzVCQSxJQUFBLGtCQUFBLE1BQUEsT0FBQTtJQUNBLFdBQUE7Ozs7Ozs7SUFPQSxpQkFBQSxTQUFBLEtBQUEsU0FBQTtRQUNBLEdBQUEsQ0FBQSxLQUFBLFdBQUEsTUFBQTtZQUNBLEtBQUEsV0FBQSxRQUFBOztRQUVBLEtBQUEsV0FBQSxNQUFBLEtBQUE7Ozs7Ozs7OztJQVNBLG9CQUFBLFNBQUEsS0FBQSxTQUFBO01BQ0EsR0FBQSxLQUFBLFdBQUEsTUFBQTtRQUNBLElBQUEsUUFBQSxLQUFBLFdBQUEsTUFBQSxRQUFBOztRQUVBLEdBQUEsUUFBQSxDQUFBLEVBQUE7WUFDQSxLQUFBLFdBQUEsTUFBQSxPQUFBLE1BQUE7Ozs7Ozs7Ozs7SUFVQSxjQUFBLFVBQUE7UUFDQSxJQUFBOztRQUVBLEdBQUEsT0FBQSxVQUFBLE9BQUEsU0FBQTtZQUNBLFFBQUEsS0FBQSxrQkFBQTthQUNBO1lBQ0EsWUFBQSxLQUFBLFdBQUEsVUFBQTs7WUFFQSxJQUFBLElBQUEsT0FBQSxVQUFBOztnQkFFQSxVQUFBLEtBQUEsVUFBQSxHQUFBLFVBQUEsR0FBQSxVQUFBLEdBQUEsVUFBQSxHQUFBLFVBQUEsR0FBQSxVQUFBLEdBQUEsVUFBQTs7Ozs7Ozs7QUN2REEsUUFBQSxPQUFBLGVBQUE7Q0FDQSxRQUFBLHdCQUFBLENBQUEsY0FBQSxNQUFBOztBQUVBLFNBQUEscUJBQUEsWUFBQSxJQUFBO0lBQ0EsSUFBQSxhQUFBLEdBQUE7O0lBRUEsR0FBQSxFQUFBLHVCQUFBLFNBQUEsRUFBQTtRQUNBLElBQUEsZUFBQSxZQUFBO1lBQ0EsSUFBQSxpQkFBQSxVQUFBO2dCQUNBLFdBQUEsUUFBQSxPQUFBOzs7WUFHQSxPQUFBLE9BQUEsS0FBQSxpQkFBQSxPQUFBLENBQUEsV0FBQSxDQUFBLGFBQUEsUUFBQSxXQUFBOzs7O1FBSUEsSUFBQSxZQUFBLEVBQUE7Ozs7Ozs7OztRQVNBLEVBQUEsVUFBQSxnQ0FBQSxTQUFBLE1BQUEsWUFBQSxNQUFBO1lBQ0EsR0FBQSxNQUFBLFNBQUEsSUFBQTtnQkFDQTttQkFDQTtnQkFDQSxXQUFBLE9BQUEsQ0FBQSxLQUFBLE1BQUEsUUFBQSxPQUFBOzs7O1dBSUE7UUFDQSxXQUFBLFFBQUEsT0FBQTs7OztJQUlBLE9BQUEsV0FBQTs7Ozs7Ozs7OztBQy9CQSxPQUFBLFlBQUEsU0FBQSxXQUFBO0dBQ0E7R0FDQSxJQUFBLFFBQUEsV0FBQSxNQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxRQUFBO0dBQ0EsSUFBQSxRQUFBOztHQUVBLElBQUEsS0FBQSxNQUFBO09BQ0EsT0FBQSxNQUFBOztPQUVBLEdBQUEsS0FBQSxRQUFBLFVBQUE7V0FDQSxLQUFBLFFBQUE7OztPQUdBLE9BQUEsS0FBQTs7R0FFQSxPQUFBOzs7QUN2QkEsQ0FBQSxZQUFBO0dBQ0E7Ozs7Ozs7Ozs7R0FVQSxJQUFBLHdCQUFBLE1BQUEsT0FBQTs7T0FFQSxVQUFBLElBQUE7Ozs7Ozs7T0FPQSxNQUFBLENBQUEsWUFBQTtXQUNBLEtBQUEsU0FBQSxTQUFBLEtBQUEsU0FBQTtXQUNBLE9BQUEsS0FBQTs7OztHQUlBLFFBQUEsT0FBQSxpQkFBQTtRQUNBLFNBQUEsaUJBQUE7O0FDM0JBLFFBQUEsT0FBQSxlQUFBOztDQUVBLFVBQUEsbUJBQUEsV0FBQTs7RUFFQSxJQUFBOztFQUVBLElBQUEsT0FBQSxTQUFBLE9BQUEsS0FBQSxPQUFBLE1BQUE7SUFDQSxHQUFBLE1BQUEsV0FBQSxLQUFBO01BQ0EsYUFBQSxFQUFBLEtBQUEsUUFBQSx1QkFBQSxLQUFBOztJQUVBLEdBQUEsTUFBQSxVQUFBLEtBQUE7TUFDQSxJQUFBLFdBQUEsRUFBQSxxQ0FBQSxXQUFBO01BQ0EsSUFBQSxVQUFBLFNBQUEsS0FBQTtNQUNBLFNBQUEsU0FBQTs7O0lBR0EsSUFBQSxTQUFBLE1BQUE7SUFDQSxHQUFBLE9BQUE7TUFDQSxJQUFBLFNBQUEsT0FBQSxNQUFBO1VBQ0E7VUFDQTtVQUNBLFdBQUE7O01BRUEsR0FBQSxPQUFBLE9BQUEsRUFBQTtRQUNBLFdBQUEsT0FBQTtRQUNBLFFBQUEsT0FBQSxHQUFBLE1BQUEsS0FBQTtRQUNBLFdBQUE7OztNQUdBLEVBQUEsS0FBQSxHQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsR0FBQSxTQUFBO1VBQ0EsTUFBQSxVQUFBLE1BQUE7Ozs7TUFJQSxNQUFBLElBQUEsWUFBQSxVQUFBO1FBQ0EsRUFBQSxLQUFBLElBQUEsU0FBQTs7Ozs7RUFLQSxPQUFBO0lBQ0EsVUFBQTtJQUNBLE1BQUE7Ozs7Q0FJQSxVQUFBLFlBQUEsVUFBQTs7RUFFQSxJQUFBLE9BQUEsU0FBQSxPQUFBLElBQUEsTUFBQTtJQUNBLEVBQUEsSUFBQSxHQUFBLGtCQUFBLFNBQUEsRUFBQTtNQUNBLEVBQUEsTUFBQSxHQUFBLHNCQUFBLFNBQUEsRUFBQTtRQUNBLEVBQUE7Ozs7SUFJQSxFQUFBLElBQUEsR0FBQSxpQkFBQSxTQUFBLEVBQUE7TUFDQSxFQUFBLE1BQUEsSUFBQTs7O0lBR0EsTUFBQSxJQUFBLFlBQUEsVUFBQTtNQUNBLEVBQUEsSUFBQSxJQUFBOzs7O0VBSUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxLQUFBO0lBQ0EsTUFBQTs7Ozs7O0FDckVBLENBQUEsVUFBQSxHQUFBO0lBQ0EsRUFBQSxLQUFBLENBQUEsUUFBQSxTQUFBLFVBQUEsR0FBQSxJQUFBO1FBQ0EsSUFBQSxLQUFBLEVBQUEsR0FBQTtRQUNBLEVBQUEsR0FBQSxNQUFBLFlBQUE7WUFDQSxLQUFBLFFBQUEsSUFBQTtZQUNBLE9BQUEsR0FBQSxNQUFBLE1BQUE7OztHQUdBOztBQUVBLE9BQUEsVUFBQSx3QkFBQSxXQUFBO0lBQ0EsT0FBQSxLQUFBLE9BQUEsR0FBQSxnQkFBQSxLQUFBLE1BQUE7OztBQ1hBLFFBQUEsT0FBQSxpQkFBQSxDQUFBLDJCQUFBOztBQUVBLFFBQUEsT0FBQSwyQkFBQTtDQUNBLFVBQUEsYUFBQSxVQUFBOztJQUVBLElBQUEsV0FBQSxTQUFBLEtBQUEsSUFBQTtRQUNBLElBQUEsT0FBQSxJQUFBLE1BQUE7UUFDQSxTQUFBO1FBQ0EsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsUUFBQSxFQUFBLEdBQUEsSUFBQTtZQUNBLFNBQUEsT0FBQSxLQUFBOztRQUVBLE9BQUE7OztJQUdBLElBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLE1BQUE7UUFDQSxJQUFBLFVBQUEsTUFBQTtRQUNBLFNBQUEsTUFBQTs7UUFFQSxJQUFBLEtBQUEsVUFBQTtZQUNBLEVBQUEsU0FBQTs7WUFFQSxHQUFBLE9BQUE7Z0JBQ0EsRUFBQSxTQUFBLFNBQUEseUJBQUEsSUFBQSxRQUFBOzs7O1FBSUEsR0FBQSxPQUFBO1lBQ0EsUUFBQSxZQUFBLEtBQUEsU0FBQSxLQUFBO2dCQUNBLElBQUEsTUFBQSxNQUFBLFNBQUEsSUFBQSxVQUFBO2dCQUNBLE9BQUE7Ozs7UUFJQSxNQUFBLE9BQUEsTUFBQSxTQUFBOzs7O0lBSUEsT0FBQTtRQUNBLFVBQUE7UUFDQSxTQUFBLENBQUE7UUFDQSxNQUFBOzs7Ozs7Ozs7Ozs7OztBQWNBLFFBQUEsT0FBQSw2QkFBQTtLQUNBLFVBQUEsY0FBQSxDQUFBLFlBQUEsWUFBQSxVQUFBLFVBQUEsVUFBQTtRQUNBLE9BQUE7WUFDQSxZQUFBO1lBQ0EsT0FBQTtZQUNBLE1BQUEsVUFBQSxPQUFBLFNBQUE7Z0JBQ0EsU0FBQSxZQUFBO29CQUNBLFlBQUE7O29CQUVBLFFBQUEsS0FBQSxtQkFBQSxLQUFBLFVBQUEsT0FBQSxXQUFBO3dCQUNBLFlBQUEsUUFBQSxRQUFBO3dCQUNBLElBQUEsQ0FBQSxVQUFBLFNBQUEsbUNBQUEsUUFBQTs0QkFDQSxVQUFBOzs7OztZQUtBLFVBQUE7Ozs7QUN2RUEsUUFBQSxPQUFBLFFBQUE7SUFDQTtJQUNBO0lBQ0E7OztJQUdBO0lBQ0E7SUFDQTtJQUNBOzs7SUFHQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOzs7SUFHQTtJQUNBO0lBQ0E7SUFDQTs7O0lBR0E7SUFDQTs7O0lBR0E7OztJQUdBOztJQUVBOzs7QUNsQ0EsSUFBQSxNQUFBLFFBQUEsT0FBQTs7QUFFQSxJQUFBLFVBQUEsU0FBQSxTQUFBO0lBQ0EsT0FBQSxTQUFBOzs7O0FBR0EsSUFBQSxhQUFBLFNBQUEsVUFBQSxhQUFBO0lBQ0EsSUFBQSxRQUFBLGFBQUE7SUFDQSxPQUFBLFNBQUEsV0FBQTs7Ozs7QUFJQSxJQUFBLGdEQUFBLFNBQUEsZ0JBQUEsb0JBQUE7SUFDQSxtQkFBQSxVQUFBOztJQUVBOztTQUVBLE1BQUEsUUFBQTtZQUNBLEtBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTtZQUNBLFNBQUE7Z0JBQ0EsU0FBQTs7O1NBR0EsTUFBQSxPQUFBO1lBQ0EsS0FBQTtZQUNBLGFBQUE7WUFDQSxZQUFBO1lBQ0EsU0FBQTtnQkFDQSxZQUFBOzs7O1NBSUEsTUFBQSxTQUFBO1lBQ0EsS0FBQTtZQUNBLGFBQUE7WUFDQSxZQUFBO1lBQ0EsU0FBQTs7OztTQUlBLE1BQUEsUUFBQTtZQUNBLEtBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTtZQUNBLFNBQUE7Ozs7Ozs7QUFPQSxJQUFBLG9CQUFBLFNBQUEsVUFBQTtJQUNBLFNBQUEsVUFBQSxzQ0FBQSxTQUFBLFdBQUEsWUFBQTtRQUNBLFdBQUEsSUFBQSxxQkFBQSxTQUFBLE9BQUEsT0FBQSxRQUFBO1lBQ0EsVUFBQSxPQUFBO1lBQ0EsVUFBQSxXQUFBOztRQUVBLE9BQUE7Ozs7O0FBS0EsSUFBQSxvQkFBQSxTQUFBLFVBQUE7RUFDQSxTQUFBLFVBQUEsc0NBQUEsU0FBQSxXQUFBLFlBQUE7SUFDQSxXQUFBLElBQUEscUJBQUEsU0FBQSxPQUFBLE9BQUEsUUFBQTtNQUNBLFVBQUEsT0FBQTtNQUNBLFVBQUEsV0FBQTs7SUFFQSxPQUFBOzs7O0FDdEVBOztBQUVBLFVBQUEsaUJBQUEsY0FBQTtBQUNBLFVBQUEsaUJBQUEsZUFBQTs7QUFFQSxJQUFBLFdBQUEsZ0JBQUEsT0FBQTtJQUNBLEtBQUE7SUFDQSxPQUFBO0lBQ0EsYUFBQTtJQUNBLGVBQUE7SUFDQSxhQUFBOztJQUVBLFNBQUEsVUFBQTtRQUNBLE9BQUEsS0FBQSxhQUFBLFVBQUEsS0FBQSxTQUFBLEtBQUE7WUFDQSxLQUFBLE9BQUE7WUFDQSxPQUFBO1VBQ0EsS0FBQSxPQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUE7Ozs7SUFJQSxZQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUEsS0FBQSxhQUFBLFdBQUEsT0FBQSxLQUFBLFNBQUEsSUFBQTtZQUNBLEtBQUEsTUFBQTtZQUNBLE9BQUE7VUFDQSxLQUFBLE9BQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQTs7OztJQUlBLFdBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxLQUFBLGFBQUEsVUFBQSxLQUFBLEtBQUEsU0FBQSxJQUFBO1lBQ0EsS0FBQSxNQUFBO1lBQ0EsT0FBQTtVQUNBLEtBQUEsT0FBQSxTQUFBLE1BQUE7WUFDQSxP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LEtBQUE7WUFDQSxLQUFBLGNBQUE7WUFDQSxLQUFBLGNBQUEsT0FBQSxPQUFBLE9BQUE7WUFDQSxPQUFBO1VBQ0EsS0FBQSxPQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUE7VUFDQSxLQUFBOzs7SUFHQSxTQUFBLFVBQUE7UUFDQSxPQUFBLEtBQUEsYUFBQSxVQUFBLEtBQUEsVUFBQTtZQUNBLEtBQUEsY0FBQSxPQUFBLE9BQUEsT0FBQTs7OztJQUlBLFlBQUEsU0FBQSxLQUFBOzs7O0lBSUEsVUFBQSxVQUFBO1FBQ0EsT0FBQSxLQUFBLGFBQUEsV0FBQSxLQUFBLFNBQUEsUUFBQTtZQUNBLEtBQUEsUUFBQTtZQUNBLEtBQUEsY0FBQSxPQUFBLE9BQUEsT0FBQTtZQUNBLE9BQUEsTUFBQSxRQUFBLEdBQUE7VUFDQSxLQUFBOzs7SUFHQSxhQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsS0FBQSxhQUFBLFlBQUEsSUFBQSxLQUFBLFNBQUEsUUFBQTtZQUNBLEtBQUEsVUFBQTtZQUNBLEtBQUEsY0FBQSxPQUFBLE9BQUEsT0FBQTtZQUNBLE9BQUEsTUFBQSxRQUFBLEdBQUE7VUFDQSxLQUFBOzs7SUFHQSxlQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsS0FBQSxhQUFBLGVBQUEsS0FBQSxLQUFBLFNBQUEsUUFBQTtZQUNBLEtBQUEsUUFBQTtZQUNBLEtBQUEsY0FBQSxPQUFBLE9BQUEsT0FBQTtZQUNBLE9BQUEsTUFBQSxRQUFBLEdBQUE7VUFDQSxLQUFBOzs7SUFHQSx1QkFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLEtBQUEsYUFBQSx1QkFBQSxLQUFBLEtBQUEsU0FBQSxRQUFBO1lBQ0EsS0FBQSxRQUFBO1lBQ0EsS0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBO1lBQ0EsT0FBQSxNQUFBLFFBQUEsR0FBQTtVQUNBLEtBQUE7OztJQUdBLFlBQUEsVUFBQTtRQUNBLElBQUEsT0FBQSxJQUFBLE1BQUE7O1FBRUEsT0FBQTs7O0lBR0EsWUFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLEtBQUEsYUFBQSxXQUFBOzs7SUFHQSxZQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxNQUFBLElBQUEsYUFBQTtZQUNBLFFBQUEsS0FBQTtZQUNBLE9BQUEsS0FBQSxXQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUEsV0FBQTtZQUNBLFFBQUEsS0FBQSxXQUFBO1lBQ0EsVUFBQSxLQUFBLFdBQUE7Ozs7SUFJQSxZQUFBLFVBQUE7UUFDQSxPQUFBLEtBQUEsYUFBQSxhQUFBLEtBQUEsU0FBQSxRQUFBO1lBQ0EsS0FBQSxVQUFBO1lBQ0EsT0FBQSxNQUFBLFFBQUEsR0FBQTtVQUNBLEtBQUE7Ozs7OztBQU1BLENBQUEsV0FBQTtJQUNBLElBQUEsb0JBQUEsTUFBQSxPQUFBO1FBQ0EsVUFBQSxJQUFBOztRQUVBLHdDQUFBLFNBQUEsY0FBQSxjQUFBO1lBQ0EsS0FBQSxTQUFBLGVBQUE7WUFDQSxLQUFBLFNBQUEsZ0JBQUE7WUFDQSxLQUFBLFNBQUEsY0FBQSxNQUFBLEtBQUE7WUFDQSxPQUFBLEtBQUE7Ozs7SUFJQSxRQUFBLE9BQUEsWUFBQTtTQUNBLFNBQUEsYUFBQTs7O0FDM0hBOztBQUVBLElBQUEsZUFBQSxNQUFBLE9BQUE7O0lBRUEsS0FBQSxNQUFBLE9BQUEsT0FBQTtJQUNBLE1BQUEsTUFBQSxPQUFBLE9BQUE7SUFDQSxZQUFBLE1BQUEsT0FBQSxPQUFBO0lBQ0EsUUFBQSxJQUFBLE1BQUE7SUFDQSxTQUFBLElBQUEsTUFBQTtJQUNBLGVBQUEsSUFBQSxNQUFBOzs7SUFHQSxjQUFBLFVBQUE7UUFDQSxJQUFBLFNBQUE7UUFDQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxJQUFBO1lBQ0EsU0FBQSxPQUFBLENBQUEsS0FBQSxNQUFBLEtBQUEsV0FBQSxLQUFBLEdBQUE7O1FBRUEsT0FBQTs7OztJQUlBLE9BQUEsU0FBQSxVQUFBLFNBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFVBQUEsVUFBQTtZQUNBLFNBQUEsU0FBQSxNQUFBO2dCQUNBLE9BQUE7O1lBRUEsT0FBQSxTQUFBLE1BQUEsT0FBQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsT0FBQTs7Ozs7SUFLQSxTQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQTs7O0lBR0EsUUFBQSxTQUFBLFVBQUEsU0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsVUFBQSxVQUFBO1lBQ0EsU0FBQSxTQUFBLE1BQUE7Z0JBQ0EsT0FBQTs7WUFFQSxPQUFBLFNBQUEsTUFBQSxPQUFBO2dCQUNBLFFBQUEsSUFBQTtnQkFDQSxPQUFBOzs7Ozs7SUFNQSxZQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxNQUFBLElBQUEsYUFBQTs7OztJQUlBLFlBQUEsU0FBQSxLQUFBOzs7OztJQUtBLGdCQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQTs7OztJQUlBLFVBQUEsVUFBQTtRQUNBLElBQUEsUUFBQSxJQUFBLE1BQUEsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBOzs7O0lBSUEsYUFBQSxTQUFBLEdBQUE7UUFDQSxJQUFBLFFBQUEsSUFBQSxNQUFBLE1BQUE7UUFDQSxNQUFBLFFBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQTs7OztJQUlBLFdBQUEsU0FBQSxPQUFBO1FBQ0EsT0FBQSxNQUFBLE1BQUEsSUFBQSxjQUFBOzs7Ozs7SUFNQSxXQUFBLFNBQUEsSUFBQTtRQUNBLElBQUEsU0FBQSxJQUFBLEtBQUE7UUFDQSxPQUFBLElBQUEsUUFBQSxJQUFBO1FBQ0EsT0FBQSxJQUFBLFlBQUEsSUFBQTtRQUNBLE9BQUEsSUFBQSxRQUFBO1FBQ0EsT0FBQSxJQUFBLFNBQUEsTUFBQSxLQUFBO1FBQ0EsT0FBQSxPQUFBLEtBQUEsTUFBQTtZQUNBLFNBQUEsU0FBQSxPQUFBO2dCQUNBLE9BQUE7ZUFDQSxPQUFBLFNBQUEsUUFBQSxNQUFBO2dCQUNBLE9BQUE7Ozs7OztJQU1BLFdBQUEsVUFBQTs7Ozs7SUFLQSxTQUFBLFVBQUE7UUFDQSxJQUFBLFFBQUEsSUFBQSxNQUFBLE1BQUE7UUFDQSxNQUFBLFFBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQTtZQUNBLFNBQUEsU0FBQSxLQUFBO2dCQUNBLE9BQUE7ZUFDQSxPQUFBLFNBQUEsTUFBQTtnQkFDQSxPQUFBOzs7Ozs7SUFNQSxZQUFBLFNBQUEsR0FBQTtRQUNBLElBQUEsUUFBQSxJQUFBLE1BQUEsTUFBQTtRQUNBLE1BQUEsUUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLElBQUE7WUFDQSxTQUFBLFNBQUEsSUFBQTtnQkFDQSxPQUFBO2VBQ0EsT0FBQSxTQUFBLEtBQUEsTUFBQTtnQkFDQSxPQUFBOzs7Ozs7SUFNQSxXQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxNQUFBLElBQUEsYUFBQSxDQUFBLE9BQUEsT0FBQSxRQUFBLE1BQUEsS0FBQSxVQUFBOzs7Ozs7SUFNQSxtQkFBQSxTQUFBLE1BQUEsSUFBQTtRQUNBLElBQUEsV0FBQSxLQUFBLEdBQUE7UUFDQSxJQUFBLGFBQUEsSUFBQSxLQUFBO1FBQ0EsV0FBQSxJQUFBLFdBQUEsTUFBQSxLQUFBO1FBQ0EsV0FBQSxJQUFBLE9BQUE7UUFDQSxXQUFBLElBQUEsU0FBQSxLQUFBO1FBQ0EsV0FBQSxJQUFBLGFBQUEsS0FBQTtRQUNBLFdBQUEsSUFBQSxlQUFBLEtBQUE7UUFDQSxXQUFBLElBQUEsUUFBQSxLQUFBO1FBQ0EsV0FBQSxJQUFBLGFBQUEsS0FBQTtRQUNBLFdBQUEsSUFBQSxpQkFBQSxLQUFBOztRQUVBLFdBQUEsS0FBQSxNQUFBO1lBQ0EsU0FBQSxTQUFBLE9BQUE7Z0JBQ0EsU0FBQSxRQUFBO2VBQ0EsT0FBQSxTQUFBLE1BQUE7Z0JBQ0EsU0FBQSxPQUFBOzs7O1FBSUEsT0FBQSxTQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdDQSxDQUFBLFVBQUE7SUFDQSxJQUFBLHVCQUFBLE1BQUEsT0FBQTtRQUNBLFNBQUEsSUFBQTtRQUNBLGFBQUEsU0FBQSxHQUFBOztZQUVBLE1BQUEsV0FBQSw0Q0FBQTtZQUNBLEtBQUEsU0FBQSxLQUFBO1lBQ0EsS0FBQSxTQUFBLE9BQUEsb0JBQUE7WUFDQSxLQUFBLFNBQUEsT0FBQSxxQkFBQTtZQUNBLEtBQUEsU0FBQSxRQUFB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QUFBO1FBQ0EsS0FBQSxPQUFBLFVBQUE7UUFDQSxHQUFBLENBQUEsS0FBQSxPQUFBLFNBQUE7WUFDQSxLQUFBLE9BQUE7Ozs7O0FBS0EsUUFBQSxPQUFBLFVBQUE7S0FDQSxVQUFBLDJDQUFBLFNBQUEsWUFBQSxjQUFBO0NBQ0EsT0FBQTtLQUNBLFNBQUE7S0FDQSxRQUFBO0tBQ0EsTUFBQSxTQUFBLE9BQUE7RUFDQSxJQUFBLGlCQUFBLFFBQUEsWUFBQTs7S0FFQSxNQUFBO1lBQ0EsYUFBQTs7OztBQ3BEQTtBQUNBLFVBQUEsaUJBQUEsVUFBQTtBQUNBLFVBQUEsaUJBQUEsVUFBQTtBQUNBLFVBQUEsaUJBQUEsWUFBQTtBQUNBLFVBQUEsaUJBQUEsZUFBQTs7QUFFQSxJQUFBLGtCQUFBLGNBQUEsT0FBQTtJQUNBLGVBQUE7O0lBRUEsTUFBQSxTQUFBLFFBQUEsWUFBQSxjQUFBO1FBQ0EsS0FBQSxhQUFBO1FBQ0EsS0FBQSxnQkFBQTtRQUNBLEtBQUEsT0FBQTs7O0lBR0EsaUJBQUEsVUFBQTtRQUNBLEtBQUE7OztJQUdBLGFBQUEsVUFBQTtRQUNBLEtBQUE7UUFDQSxRQUFBLElBQUE7OztJQUdBLFNBQUEsVUFBQTtRQUNBLEtBQUE7Ozs7O0FBS0EsUUFBQSxPQUFBLFNBQUE7S0FDQSxVQUFBLDBDQUFBLFNBQUEsWUFBQSxjQUFBO0NBQ0EsT0FBQTtLQUNBLFNBQUE7S0FDQSxRQUFBO0tBQ0EsTUFBQSxTQUFBLE9BQUE7RUFDQSxJQUFBLGdCQUFBLFFBQUEsWUFBQTs7S0FFQSxNQUFBO1lBQ0EsYUFBQTs7OztBQ3ZDQTs7QUFFQSxJQUFBLG9CQUFBLGNBQUEsT0FBQTtJQUNBLFVBQUE7SUFDQSxXQUFBO0lBQ0EsZUFBQTs7SUFFQSxZQUFBLFNBQUEsUUFBQSxRQUFBLFdBQUEsZUFBQSxVQUFBLFVBQUE7UUFDQSxLQUFBLFNBQUE7UUFDQSxLQUFBLFlBQUE7UUFDQSxLQUFBLGdCQUFBO1FBQ0EsS0FBQSxXQUFBO1FBQ0EsS0FBQSxZQUFBOzs7SUFHQSxpQkFBQSxVQUFBO1FBQ0EsS0FBQTs7O0lBR0Es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O1FBQ0EsUUFBQSxJQUFBO1FBQ0EsS0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBO1FBQ0EsS0FBQSxTQUFBLGtCQUFBLEtBQUEsT0FBQSxNQUFBLEtBQUEsU0FBQSxRQUFBO1lBQ0EsS0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBO1lBQ0EsWUFBQSxNQUFBLGVBQUEsTUFBQTtVQUNBLEtBQUE7Ozs7O0FBS0EsUUFBQSxPQUFBLGVBQUE7S0FDQSxVQUFBLHFFQUFBLFNBQUEsUUFBQSxXQUFBLGVBQUEsU0FBQTtRQUNBLE9BQUE7WUFDQSxTQUFBO1lBQ0EsTUFBQSxTQUFBLE9BQUE7Z0JBQ0EsSUFBQSxzQkFBQSxRQUFBLFFBQUEsV0FBQSxlQUFBOztZQUVBLE1BQUE7WUFDQSxhQUFBOzs7O0FDL0NBOztBQUVBLFVBQUEsaUJBQUEsbUJBQUE7O0FBRUEsSUFBQSxzQkFBQSxjQUFBLE9BQUE7SUFDQSxXQUFBO0lBQ0EsZUFBQTs7SUFFQSxZQUFBLFNBQUEsUUFBQSxRQUFBLFdBQUEsY0FBQTtRQUNBLEtBQUEsU0FBQTtRQUNBLEtBQUEsWUFBQTtRQUNBLEtBQUEsZ0JBQUE7OztJQUdBLGlCQUFBLFVBQUE7UUFDQSxLQUFBO1FBQ0EsS0FBQSxjQUFBLEtBQUEsWUFBQSxLQUFBO1FBQ0EsS0FBQSxjQUFBLGlCQUFBLE9BQUEsT0FBQSxrQkFBQSxLQUFBOzs7SUFHQSxhQUFBLFVBQUE7UUFDQSxLQUFBO1FBQ0EsS0FBQSxPQUFBLFFBQUEsS0FBQSxNQUFBLEtBQUE7UUFDQSxLQUFBLE9BQUEsU0FBQSxLQUFBLE9BQUEsS0FBQTtRQUNBLEtBQUEsT0FBQSxPQUFBO1FBQ0EsS0FBQSxPQUFBLFVBQUE7OztJQUdBLGFBQUEsVUFBQTtRQUNBLEVBQUEsZUFBQTs7O0lBR0EsT0FBQSxVQUFBO1FBQ0EsS0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBO1FBQ0EsS0FBQSxVQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsVUFBQSxLQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUEsU0FBQSxLQUFBO1lBQ0EsS0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBO1lBQ0EsRUFBQSxlQUFBO1VBQ0EsS0FBQSxPQUFBLFNBQUEsTUFBQTtZQUNBLEtBQUEsY0FBQSxPQUFBLE9BQUEsT0FBQTtZQUNBLFFBQUEsSUFBQTtZQUNBLEtBQUEsT0FBQSxRQUFBO1lBQ0EsS0FBQSxPQUFBLGVBQUEsTUFBQTtZQUNBLEtBQUEsT0FBQTtVQUNBLEtBQUE7OztJQUdBLFFBQUEsVUFBQTtRQUNBLEtBQUEsY0FBQSxPQUFBLE9BQUEsT0FBQTtRQUNBLFFBQUEsSUFBQSxLQUFBLE9BQUE7UUFDQSxLQUFBLFVBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUEsT0FBQSxLQUFBLFVBQUEsS0FBQSxTQUFBLEtBQUE7WUFDQSxLQUFBLGNBQUEsT0FBQSxPQUFBLE9BQUE7WUFDQSxFQUFBLGVBQUE7VUFDQSxLQUFBLE9BQUEsU0FBQSxNQUFBO1lBQ0EsS0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBO1lBQ0EsUUFBQSxJQUFBO1lBQ0EsS0FBQSxPQUFBLFFBQUE7WUFDQSxLQUFBLE9BQUEsZUFBQSxNQUFBO1lBQ0EsS0FBQSxPQUFBO1VBQ0EsS0FBQTs7Ozs7O0FBTUEsUUFBQSxPQUFBLGFBQUE7S0FDQSxVQUFBLHVEQUFBLFNBQUEsUUFBQSxXQUFBLGNBQUE7UUFDQSxPQUFBO1lBQ0EsU0FBQTtZQUNBLE1BQUEsU0FBQSxPQUFBO2dCQUNBLElBQUEsb0JBQUEsUUFBQSxRQUFBLFdBQUE7O1lBRUEsTUFBQTtZQUNBLGFBQUE7Ozs7QUN4RUE7O0FBRUEsSUFBQSxvQkFBQSxjQUFBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsZUFBQTs7SUFFQSxZQUFBLFNBQUEsUUFBQSxRQUFBLFdBQUEsZUFBQSxTQUFBO1FBQ0EsS0FBQSxTQUFBO1FBQ0EsS0FBQSxZQUFBO1FBQ0EsS0FBQSxnQkFBQTtRQUNBLEtBQUEsV0FBQTs7O0lBR0EsaUJBQUEsVUFBQTtRQUNBLEtBQUE7Ozs7SUFJQSxhQUFBLFVBQUE7UUFDQSxLQUFBO1FBQ0EsS0FBQSxPQUFBLE9BQUEsS0FBQSxTQUFBOzs7SUFHQSxTQUFBLFVBQUE7UUFDQSxLQUFBOzs7Ozs7QUFNQSxRQUFBLE9BQUEsV0FBQTtLQUNBLFVBQUEsaUVBQUEsU0FBQSxRQUFBLFdBQUEsZUFBQSxTQUFBO1FBQ0EsT0FBQTtZQUNBLFNBQUE7WUFDQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxJQUFBLGtCQUFBLFFBQUEsUUFBQSxXQUFBLGVBQUE7O1lBRUEsT0FBQTtZQUNBLGFBQUE7Ozs7QUN0Q0E7O0FBRUEsSUFBQSx3QkFBQSxjQUFBLE9BQUE7SUFDQSxVQUFBO0lBQ0EsV0FBQTtJQUNBLGVBQUE7O0lBRUEsWUFBQSxTQUFBLFFBQUEsUUFBQSxXQUFBLGVBQUEsU0FBQTtRQUNBLEtBQUEsU0FBQTtRQUNBLEtBQUEsWUFBQTtRQUNBLEtBQUEsZ0JBQUE7UUFDQSxLQUFBLFdBQUE7OztJQUdBLGlCQUFBLFVBQUE7UUFDQSxLQUFBOzs7SUFHQSxhQUFBLFVBQUE7UUFDQSxLQUFBOzs7SUFHQSxTQUFBLFVBQUE7UUFDQSxLQUFBOzs7Ozs7QUFNQSxRQUFBLE9BQUEsZUFBQTtLQUNBLFVBQUEscUVBQUEsU0FBQSxRQUFBLFdBQUEsZUFBQSxTQUFBO1FBQ0EsT0FBQTtZQUNBLFNBQUE7WUFDQSxNQUFBLFNBQUEsT0FBQTtnQkFDQSxJQUFBLHNCQUFBLFFBQUEsUUFBQSxXQUFBLGVBQUE7O1lBRUEsTUFBQTtZQUNBLGFBQUE7Ozs7QUNyQ0EsSUFBQSxxQkFBQSxlQUFBLE9BQUE7O0lBRUEsV0FBQSxTQUFBLFFBQUEsUUFBQSxlQUFBLFdBQUEsU0FBQTtRQUNBLEtBQUEsWUFBQTtRQUNBLEtBQUEsV0FBQTtRQUNBLEtBQUEsU0FBQTtRQUNBLEtBQUEsZ0JBQUE7OztJQUdBLGdCQUFBLFVBQUE7UUFDQSxLQUFBOzs7SUFHQSxZQUFBLFVBQUE7UUFDQSxLQUFBO1FBQ0EsS0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBLGNBQUE7UUFDQSxLQUFBLE9BQUEsT0FBQSxLQUFBLFVBQUE7UUFDQSxLQUFBLGNBQUEsT0FBQSxPQUFBLE9BQUE7OztJQUdBLFFBQUEsVUFBQTtRQUNBLEtBQUE7Ozs7QUFJQSxtQkFBQSxVQUFBLENBQUEsVUFBQSxVQUFBLGlCQUFBLGFBQUE7O0FDekJBLElBQUEsc0JBQUEsZUFBQSxPQUFBOztJQUVBLFdBQUEsU0FBQSxRQUFBLFFBQUEsZUFBQSxXQUFBLFNBQUE7UUFDQSxLQUFBLFlBQUE7UUFDQSxLQUFBLFdBQUE7UUFDQSxLQUFBLFNBQUE7UUFDQSxLQUFBLGdCQUFBOzs7SUFHQSxnQkFBQSxVQUFBO1FBQ0EsS0FBQTs7O0lBR0EsWUFBQSxVQUFBO1FBQ0EsS0FBQTtRQUNBLEtBQUEsY0FBQSxPQUFBLE9BQUEsT0FBQSxjQUFBO1FBQ0EsS0FBQSxPQUFBLFFBQUEsS0FBQSxVQUFBO1FBQ0EsS0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBOzs7SUFHQSxRQUFBLFVBQUE7UUFDQSxLQUFBOzs7O0FBSUEsb0JBQUEsVUFBQSxDQUFBLFVBQUEsVUFBQSxpQkFBQSxhQUFBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIGZuVGVzdCA9IC94eXovLnRlc3QoZnVuY3Rpb24oKXt4eXo7fSkgPyAvXFxiX3N1cGVyXFxiLyA6IC8uKi87XG5cbiAgLy8gVGhlIGJhc2UgQ2xhc3MgaW1wbGVtZW50YXRpb24gKGRvZXMgbm90aGluZylcbiAgZnVuY3Rpb24gQmFzZUNsYXNzKCl7fVxuXG4gIC8vIENyZWF0ZSBhIG5ldyBDbGFzcyB0aGF0IGluaGVyaXRzIGZyb20gdGhpcyBjbGFzc1xuICBCYXNlQ2xhc3MuZXh0ZW5kID0gZnVuY3Rpb24ocHJvcHMpIHtcbiAgICB2YXIgX3N1cGVyID0gdGhpcy5wcm90b3R5cGU7XG5cbiAgICAvLyBTZXQgdXAgdGhlIHByb3RvdHlwZSB0byBpbmhlcml0IGZyb20gdGhlIGJhc2UgY2xhc3NcbiAgICAvLyAoYnV0IHdpdGhvdXQgcnVubmluZyB0aGUgaW5pdCBjb25zdHJ1Y3RvcilcbiAgICB2YXIgcHJvdG8gPSBPYmplY3QuY3JlYXRlKF9zdXBlcik7XG5cbiAgICAvLyBDb3B5IHRoZSBwcm9wZXJ0aWVzIG92ZXIgb250byB0aGUgbmV3IHByb3RvdHlwZVxuICAgIGZvciAodmFyIG5hbWUgaW4gcHJvcHMpIHtcbiAgICAgIC8vIENoZWNrIGlmIHdlJ3JlIG92ZXJ3cml0aW5nIGFuIGV4aXN0aW5nIGZ1bmN0aW9uXG4gICAgICBwcm90b1tuYW1lXSA9IHR5cGVvZiBwcm9wc1tuYW1lXSA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgIHR5cGVvZiBfc3VwZXJbbmFtZV0gPT0gXCJmdW5jdGlvblwiICYmIGZuVGVzdC50ZXN0KHByb3BzW25hbWVdKVxuICAgICAgICA/IChmdW5jdGlvbihuYW1lLCBmbil7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciB0bXAgPSB0aGlzLl9zdXBlcjtcblxuICAgICAgICAgICAgICAvLyBBZGQgYSBuZXcgLl9zdXBlcigpIG1ldGhvZCB0aGF0IGlzIHRoZSBzYW1lIG1ldGhvZFxuICAgICAgICAgICAgICAvLyBidXQgb24gdGhlIHN1cGVyLWNsYXNzXG4gICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gX3N1cGVyW25hbWVdO1xuXG4gICAgICAgICAgICAgIC8vIFRoZSBtZXRob2Qgb25seSBuZWVkIHRvIGJlIGJvdW5kIHRlbXBvcmFyaWx5LCBzbyB3ZVxuICAgICAgICAgICAgICAvLyByZW1vdmUgaXQgd2hlbiB3ZSdyZSBkb25lIGV4ZWN1dGluZ1xuICAgICAgICAgICAgICB2YXIgcmV0ID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgdGhpcy5fc3VwZXIgPSB0bXA7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkobmFtZSwgcHJvcHNbbmFtZV0pXG4gICAgICAgIDogcHJvcHNbbmFtZV07XG4gICAgfVxuXG4gICAgLy8gVGhlIG5ldyBjb25zdHJ1Y3RvclxuICAgIHZhciBuZXdDbGFzcyA9IHR5cGVvZiBwcm90by5pbml0ID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gcHJvdG8uaGFzT3duUHJvcGVydHkoXCJpbml0XCIpXG4gICAgICAgID8gcHJvdG8uaW5pdCAvLyBBbGwgY29uc3RydWN0aW9uIGlzIGFjdHVhbGx5IGRvbmUgaW4gdGhlIGluaXQgbWV0aG9kXG4gICAgICAgIDogZnVuY3Rpb24gU3ViQ2xhc3MoKXsgX3N1cGVyLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuICAgICAgOiBmdW5jdGlvbiBFbXB0eUNsYXNzKCl7fTtcblxuICAgIC8vIFBvcHVsYXRlIG91ciBjb25zdHJ1Y3RlZCBwcm90b3R5cGUgb2JqZWN0XG4gICAgbmV3Q2xhc3MucHJvdG90eXBlID0gcHJvdG87XG5cbiAgICAvLyBFbmZvcmNlIHRoZSBjb25zdHJ1Y3RvciB0byBiZSB3aGF0IHdlIGV4cGVjdFxuICAgIHByb3RvLmNvbnN0cnVjdG9yID0gbmV3Q2xhc3M7XG5cbiAgICAvLyBBbmQgbWFrZSB0aGlzIGNsYXNzIGV4dGVuZGFibGVcbiAgICBuZXdDbGFzcy5leHRlbmQgPSBCYXNlQ2xhc3MuZXh0ZW5kO1xuXG4gICAgcmV0dXJuIG5ld0NsYXNzO1xuICB9O1xuXG4gIC8vIGV4cG9ydFxuICBnbG9iYWwuQ2xhc3MgPSBCYXNlQ2xhc3M7XG59KSh0aGlzKTtcbiIsInZhciBCYXNlQ29udHJvbGxlciA9IENsYXNzLmV4dGVuZCh7XG4gIHNjb3BlOiBudWxsLFxuXG4gIGluaXQ6ZnVuY3Rpb24oc2NvcGUpe1xuICAgIC8vIHNldCB0aGUgc2NvcGVcbiAgICB0aGlzLiRzY29wZSA9IHNjb3BlO1xuXG4gICAgLy8gY2FsbCB0aGUgZmlyc3QgbGlmZWN5Y2xlIG1ldGhvZFxuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG5cbiAgICAvLyBiaW5kIHRoZSBkZXN0cm95IGV2ZW50IHdpdGggdGhpcyBjbGFzc1xuICAgIHRoaXMuJHNjb3BlLiRvbignJGRlc3Ryb3knLHRoaXMuZGVzdHJveS5iaW5kKHRoaXMpKTtcblxuICAgIC8vIGNhbGwgdGhlIHNlY29uZCBsaWZlY3ljbGUgbWV0aG9kXG4gICAgdGhpcy5kZWZpbmVMaXN0ZW5lcnMoKTtcblxuICAgIC8vIGNhbGwgdGhlIGxhc3QgbGlmZWN5Y2xlIG1ldGhvZFxuICAgIHRoaXMuZGVmaW5lU2NvcGUoKTtcbiAgfSxcblxuICBpbml0aWFsaXplOmZ1bmN0aW9uKCl7XG4gICAgLy9PVkVSUklERVxuICB9LFxuXG4gIGRlZmluZUxpc3RlbmVyczogZnVuY3Rpb24oKXtcbiAgICAvL09WRVJSSURFXG4gIH0sXG5cbiAgZGVmaW5lU2NvcGU6IGZ1bmN0aW9uKCl7XG4gICAgLy9PVkVSUklERVxuICB9LFxuXG4gIGRlc3Ryb3k6ZnVuY3Rpb24oZXZlbnQpe1xuICAgIC8vT1ZFUlJJREVcbiAgfVxufSk7XG5cbkJhc2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xuIiwidmFyIEJhc2VEaXJlY3RpdmUgPSBDbGFzcy5leHRlbmQoe1xuICBzY29wZTogbnVsbCxcblxuICBpbml0OmZ1bmN0aW9uKHNjb3BlKXtcbiAgICAvLyBzZXQgdGhlIHNjb3BlXG4gICAgdGhpcy4kc2NvcGUgPSBzY29wZTtcblxuICAgIC8vIGNhbGwgdGhlIGZpcnN0IGxpZmVjeWNsZSBtZXRob2RcbiAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xuXG4gICAgLy8gYmluZCB0aGUgZGVzdHJveSBldmVudCB3aXRoIHRoaXMgY2xhc3NcbiAgICB0aGlzLiRzY29wZS4kb24oJyRkZXN0cm95Jyx0aGlzLmRlc3Ryb3kuYmluZCh0aGlzKSk7XG5cbiAgICAvLyBjYWxsIHRoZSBzZWNvbmQgbGlmZWN5Y2xlIG1ldGhvZFxuICAgIHRoaXMuZGVmaW5lTGlzdGVuZXJzKCk7XG5cbiAgICAvLyBjYWxsIHRoZSBsYXN0IGxpZmVjeWNsZSBtZXRob2RcbiAgICB0aGlzLmRlZmluZVNjb3BlKCk7XG4gIH0sXG5cbiAgaW5pdGlhbGl6ZTpmdW5jdGlvbigpe1xuICAgIC8vT1ZFUlJJREVcbiAgfSxcblxuICBkZWZpbmVMaXN0ZW5lcnM6IGZ1bmN0aW9uKCl7XG4gICAgLy9PVkVSUklERVxuICB9LFxuXG4gIGRlZmluZVNjb3BlOiBmdW5jdGlvbigpe1xuICAgIC8vT1ZFUlJJREVcbiAgfSxcblxuICBkZXN0cm95OmZ1bmN0aW9uKGV2ZW50KXtcbiAgICAvL09WRVJSSURFXG4gIH1cbn0pO1xuXG5CYXNlRGlyZWN0aXZlLiRpbmplY3QgPSBbJyRzY29wZSddO1xuIiwiLyoqXG4qIEV2ZW50IGRpc3BhdGNoZXIgY2xhc3MsXG4qIGFkZCBhYmlsaXR5IHRvIGRpc3BhdGNoIGV2ZW50XG4qIG9uIG5hdGl2ZSBjbGFzc2VzLlxuKlxuKiBVc2Ugb2YgQ2xhc3MuanNcbipcbiogQGF1dGhvciB1bml2ZXJzYWxtaW5kLmNvbVxuKi9cbnZhciBFdmVudERpc3BhdGNoZXIgPSBDbGFzcy5leHRlbmQoe1xuICAgIF9saXN0ZW5lcnM6e30sXG5cbiAgICAvKipcbiAgICAqIEFkZCBhIGxpc3RlbmVyIG9uIHRoZSBvYmplY3RcbiAgICAqIEBwYXJhbSB0eXBlIDogRXZlbnQgdHlwZVxuICAgICogQHBhcmFtIGxpc3RlbmVyIDogTGlzdGVuZXIgY2FsbGJhY2tcbiAgICAqLyAgXG4gICAgYWRkRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLGxpc3RlbmVyKXtcbiAgICAgICAgaWYoIXRoaXMuX2xpc3RlbmVyc1t0eXBlXSl7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9saXN0ZW5lcnNbdHlwZV0ucHVzaChsaXN0ZW5lcilcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgICAqIFJlbW92ZSBhIGxpc3RlbmVyIG9uIHRoZSBvYmplY3RcbiAgICAgICAqIEBwYXJhbSB0eXBlIDogRXZlbnQgdHlwZVxuICAgICAgICogQHBhcmFtIGxpc3RlbmVyIDogTGlzdGVuZXIgY2FsbGJhY2tcbiAgICAgICAqLyAgXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbih0eXBlLGxpc3RlbmVyKXtcbiAgICAgIGlmKHRoaXMuX2xpc3RlbmVyc1t0eXBlXSl7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5pbmRleE9mKGxpc3RlbmVyKTtcblxuICAgICAgICBpZihpbmRleCE9PS0xKXtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVyc1t0eXBlXS5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAqIERpc3BhdGNoIGFuIGV2ZW50IHRvIGFsbCByZWdpc3RlcmVkIGxpc3RlbmVyXG4gICAgKiBAcGFyYW0gTXV0aXBsZSBwYXJhbXMgYXZhaWxhYmxlLCBmaXJzdCBtdXN0IGJlIHN0cmluZ1xuICAgICovIFxuICAgIGRpc3BhdGNoRXZlbnQ6ZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxpc3RlbmVycztcblxuICAgICAgICBpZih0eXBlb2YgYXJndW1lbnRzWzBdICE9PSAnc3RyaW5nJyl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0V2ZW50RGlzcGF0Y2hlcicsJ0ZpcnN0IHBhcmFtcyBtdXN0IGJlIGFuIGV2ZW50IHR5cGUgKFN0cmluZyknKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1thcmd1bWVudHNbMF1dO1xuXG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBsaXN0ZW5lcnMpe1xuICAgICAgICAgICAgICAgIC8vVGhpcyBjb3VsZCB1c2UgLmFwcGx5KGFyZ3VtZW50cykgaW5zdGVhZCwgYnV0IHRoZXJlIGlzIGN1cnJlbnRseSBhIGJ1ZyB3aXRoIGl0LlxuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldKGFyZ3VtZW50c1swXSxhcmd1bWVudHNbMV0sYXJndW1lbnRzWzJdLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KVxuXG5cbiIsImFuZ3VsYXIubW9kdWxlKCdHb29nbGVDaGFydHMnLFtdKVxuLmZhY3RvcnkoJ2dvb2dsZUNoYXJ0QXBpTG9hZGVyJywgWyckcm9vdFNjb3BlJywgJyRxJywgZ29vZ2xlQ2hhcnRBcGlMb2FkZXJdKTtcblxuZnVuY3Rpb24gZ29vZ2xlQ2hhcnRBcGlMb2FkZXIoJHJvb3RTY29wZSwgJHEpIHtcbiAgICB2YXIgYXBpUHJvbWlzZSA9ICRxLmRlZmVyKCk7XG5cbiAgICBpZigkKCcjZ29vZ2xlQ2hhcnRzU2NyaXB0JykubGVuZ3RoPT09MCl7XG4gICAgICAgIHZhciBvblNjcmlwdExvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb25Mb2FkQ2FsbGJhY2sgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGFwaVByb21pc2UucmVzb2x2ZSh3aW5kb3cuZ29vZ2xlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHdpbmRvdy5nb29nbGUubG9hZCgndmlzdWFsaXphdGlvbicsICcxLjAnLCB7J3BhY2thZ2VzJzpbJ2NvcmVjaGFydCcsICdiYXInXSwgJ2NhbGxiYWNrJzpvbkxvYWRDYWxsYmFja30pO1xuICAgICAgICAgICAgLy8gd2luZG93Lmdvb2dsZS5zZXRPbkxvYWRDYWxsYmFjayhvbkxvYWRDYWxsYmFjayk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHNjcmlwdFRhZyA9ICQoJzxzY3JpcHQgaWQ9XCJnb29nbGVDaGFydHNTY3JpcHRcIiB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9qc2FwaVwiPjwvc2NyaXB0PicpO1xuXG4gICAgICAgIC8vIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgLy8gdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXG4gICAgICAgIC8vIHNjcmlwdFRhZy5vbignbG9hZCcsIG9uU2NyaXB0TG9hZCk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICQoJ2JvZHknKS5hcHBlbmQoc2NyaXB0VGFnKTtcblxuICAgICAgICAkLmdldFNjcmlwdChcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vanNhcGlcIiwgZnVuY3Rpb24oZGF0YSwgdGV4dFN0YXR1cywganF4aHIpe1xuICAgICAgICAgICAgaWYoanF4aHIuc3RhdHVzPT09MjAwKXtcbiAgICAgICAgICAgICAgICBvblNjcmlwdExvYWQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXBpUHJvbWlzZS5yZWplY3Qoe2NvZGU6anF4aHIuc3RhdHVzLCBzdGF0dXM6dGV4dFN0YXR1c30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGFwaVByb21pc2UucmVzb2x2ZSh3aW5kb3cuZ29vZ2xlKTtcbiAgICB9XG5cblxuICAgIHJldHVybiBhcGlQcm9taXNlLnByb21pc2U7XG59XG4iLCIvKipcbiogU2ltcGxlIG5hbWVzcGFjZSB1dGlsIHRvIGV4dGFuZCBDbGFzcy5qcyBmdW5jdGlvbmFsaXR5XG4qIGFuZCB3cmFwIGNsYXNzZXMgaW4gbmFtZXNwYWNlLlxuKiBAYXV0aG9yIHRvbW15LnJvY2hldHRlW2ZvbGxvd2VkIGJ5IHRoZSB1c3VhbCBzaWduXXVuaXZlcnNhbG1pbmQuY29tXG4qIEB0eXBlIHsqfVxuKiBAcmV0dXJuIE9iamVjdFxuKi9cbndpbmRvdy5uYW1lc3BhY2UgPSBmdW5jdGlvbihuYW1lc3BhY2VzKXtcbiAgICd1c2Ugc3RyaWN0JztcbiAgIHZhciBuYW1lcyA9IG5hbWVzcGFjZXMuc3BsaXQoJy4nKTtcbiAgIHZhciBsYXN0ICA9IHdpbmRvdztcbiAgIHZhciBuYW1lICA9IG51bGw7XG4gICB2YXIgaSAgICAgPSBudWxsO1xuXG4gICBmb3IoaSBpbiBuYW1lcyl7XG4gICAgICAgbmFtZSA9IG5hbWVzW2ldO1xuXG4gICAgICAgaWYobGFzdFtuYW1lXT09PXVuZGVmaW5lZCl7XG4gICAgICAgICAgIGxhc3RbbmFtZV0gPSB7fTtcbiAgICAgICB9XG5cbiAgICAgICBsYXN0ID0gbGFzdFtuYW1lXTtcbiAgIH1cbiAgIHJldHVybiBsYXN0O1xufTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAndXNlIHN0cmljdCc7XG4gICAvKipcblx0ICogQ3JlYXRlIGEgZ2xvYmFsIGV2ZW50IGRpc3BhdGNoZXJcblx0ICogdGhhdCBjYW4gYmUgaW5qZWN0ZWQgYWNjcm9zcyBtdWx0aXBsZSBjb21wb25lbnRzXG5cdCAqIGluc2lkZSB0aGUgYXBwbGljYXRpb25cblx0ICpcblx0ICogVXNlIG9mIENsYXNzLmpzXG5cdCAqIEB0eXBlIHtjbGFzc31cblx0ICogQGF1dGhvciB1bml2ZXJzYWxtaW5kLmNvbVxuXHQgKi9cbiAgIHZhciBOb3RpZmljYXRpb25zUHJvdmlkZXIgPSBDbGFzcy5leHRlbmQoe1xuXG4gICAgICAgaW5zdGFuY2U6IG5ldyBFdmVudERpc3BhdGNoZXIoKSxcblxuICAgICAgIC8qKlxuICAgICAgICAqIENvbmZpZ3VyZXMgYW5kIHJldHVybnMgaW5zdGFuY2Ugb2YgR2xvYmFsRXZlbnRCdXMuXG4gICAgICAgICpcbiAgICAgICAgKiBAcmV0dXJuIHtHbG9iYWxFdmVudEJ1c31cbiAgICAgICAgKi9cbiAgICAgICAkZ2V0OiBbZnVuY3Rpb24gKCkge1xuICAgICAgIFx0ICAgdGhpcy5pbnN0YW5jZS5ub3RpZnkgPSB0aGlzLmluc3RhbmNlLmRpc3BhdGNoRXZlbnQ7XG4gICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgICAgIH1dXG4gICB9KTtcblxuICAgYW5ndWxhci5tb2R1bGUoJ25vdGlmaWNhdGlvbnMnLCBbXSlcbiAgICAgICAucHJvdmlkZXIoJ05vdGlmaWNhdGlvbnMnLCBOb3RpZmljYXRpb25zUHJvdmlkZXIpO1xufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnQ3VzdG9tTW9kdWxlJyxbXSlcblxuLmRpcmVjdGl2ZSgnbWF0RHJvcGRvd25JdGVtJywgZnVuY3Rpb24oKSB7XG5cbiAgdmFyIGRyb3Bkb3duSWQ7XG5cbiAgdmFyIGxpbmsgPSBmdW5jdGlvbihzY29wZSwgZWxtLCBhdHRycywgY3RybCkge1xuICAgIGlmKHNjb3BlLiRmaXJzdCA9PT0gdHJ1ZSl7XG4gICAgICBkcm9wZG93bklkID0gJChlbG0pLmNsb3Nlc3QoJ3VsLmRyb3Bkb3duLWNvbnRlbnQnKS5hdHRyKCdpZCcpO1xuICAgIH1cbiAgICBpZihzY29wZS4kbGFzdCA9PT0gdHJ1ZSl7XG4gICAgICB2YXIgZHJvcGRvd24gPSAkKCdhLmRyb3Bkb3duLWJ1dHRvbltkYXRhLWFjdGl2YXRlcz1cIicrZHJvcGRvd25JZCsnXCJdJyk7XG4gICAgICB2YXIgb3B0aW9ucyA9IGRyb3Bkb3duLmRhdGEoJ2Ryb3Bkb3duLW9wdGlvbnMnKTtcbiAgICAgIGRyb3Bkb3duLmRyb3Bkb3duKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHZhciBwYXJhbXMgPSBhdHRycy5tYXREcm9wZG93bkl0ZW07XG4gICAgaWYocGFyYW1zKXtcbiAgICAgIHZhciBzcGxpdHMgPSBwYXJhbXMuc3BsaXQoJygnKSxcbiAgICAgICAgICBmdW5jTmFtZSxcbiAgICAgICAgICBwTmFtZSxcbiAgICAgICAgICBoYXNQYXJhbSA9IGZhbHNlO1xuXG4gICAgICBpZihzcGxpdHMubGVuZ3RoPjEpe1xuICAgICAgICBmdW5jTmFtZSA9IHNwbGl0c1swXTtcbiAgICAgICAgcE5hbWUgPSBzcGxpdHNbMV0uc3BsaXQoJyknKVswXTtcbiAgICAgICAgaGFzUGFyYW0gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAkKGVsbSkub24oJ2NsaWNrLicrcGFyYW1zLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmKGhhc1BhcmFtKXtcbiAgICAgICAgICBzY29wZVtmdW5jTmFtZV0oc2NvcGVbcE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpe1xuICAgICAgICAkKGVsbSkub2ZmKCdjbGljay4nK3BhcmFtcyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIGxpbms6IGxpbmtcbiAgfTtcbn0pXG5cbi5kaXJlY3RpdmUoJ25vU2Nyb2xsJywgZnVuY3Rpb24oKXtcblxuICB2YXIgbGluayA9IGZ1bmN0aW9uKHNjb3BlLCBlbCwgYXR0cnMpe1xuICAgICQoZWwpLm9uKCdmb2N1cy5ub1Njcm9sbCcsIGZ1bmN0aW9uKGUpe1xuICAgICAgJCh0aGlzKS5vbignbW91c2V3aGVlbC5ub1Njcm9sbCcsZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJChlbCkub24oJ2JsdXIubm9TY3JvbGwnLCBmdW5jdGlvbihlKXtcbiAgICAgICQodGhpcykub2ZmKCdtb3VzZXdoZWVsLm5vU2Nyb2xsJyk7XG4gICAgfSk7XG5cbiAgICBzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKXtcbiAgICAgICQoZWwpLm9mZignLm5vU2Nyb2xsJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0MnLFxuICAgIGxpbms6bGluayxcbiAgICBzY29wZTp7fVxuICB9O1xufSlcblxuO1xuIiwiKGZ1bmN0aW9uICgkKSB7XG4gICAgJC5lYWNoKFsnc2hvdycsICdoaWRlJ10sIGZ1bmN0aW9uIChpLCBldikge1xuICAgICAgICB2YXIgZWwgPSAkLmZuW2V2XTtcbiAgICAgICAgJC5mbltldl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJyQnK2V2KTtcbiAgICAgICAgICAgIHJldHVybiBlbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH0pO1xufSkoalF1ZXJ5KTtcblxuU3RyaW5nLnByb3RvdHlwZS5jYXBpdGFsaXplRmlyc3RMZXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRoaXMuc2xpY2UoMSk7XG59XG4iLCJhbmd1bGFyLm1vZHVsZSgnbXcubWF0ZXJpYWxpemUnLFsnbXcubWF0ZXJpYWxpemUubWF0U2VsZWN0JywndWkubWF0ZXJpYWxpemUuaW5wdXRmaWVsZCddKTtcblxuYW5ndWxhci5tb2R1bGUoJ213Lm1hdGVyaWFsaXplLm1hdFNlbGVjdCcsW10pXG4uZGlyZWN0aXZlKCdtYXRTZWxlY3QnLCBmdW5jdGlvbigpe1xuXG4gICAgdmFyIHRyYXZlcnNlID0gZnVuY3Rpb24ob2JqLCBzdHIpe1xuICAgICAgICB2YXIga2V5cyA9IHN0ci5zcGxpdCgnLicpLFxuICAgICAgICBuZXdPYmogPSBvYmo7XG4gICAgICAgIGZvcih2YXIgaT0wLGw9a2V5cy5sZW5ndGg7IGk8bDsgaSsrKXtcbiAgICAgICAgICAgIG5ld09iaiA9IG5ld09ialtrZXlzW2ldXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3T2JqO1xuICAgIH07XG5cbiAgICB2YXIgbGluayA9IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpe1xuICAgICAgICB2YXIgbmdNb2RlbCA9IGN0cmxzWzBdLFxuICAgICAgICBwYXJhbXMgPSBhdHRycy5tYXRTZWxlY3Q7XG5cbiAgICAgICAgdmFyIGdvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQoZWxlbWVudCkubWF0ZXJpYWxfc2VsZWN0KCk7XG5cbiAgICAgICAgICAgIGlmKHBhcmFtcyl7XG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5zaWJsaW5ncyhcImlucHV0LnNlbGVjdC1kcm9wZG93blwiKS52YWwobmdNb2RlbC4kdmlld1ZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZihwYXJhbXMpe1xuICAgICAgICAgICAgbmdNb2RlbC4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSB2YWwgPyB0cmF2ZXJzZSh2YWwscGFyYW1zKSA6IHZhbDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZ28pO1xuXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6IFsnbmdNb2RlbCddLFxuICAgICAgICBsaW5rOiBsaW5rXG4gICAgfTtcbn0pO1xuXG4vKiogKHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2tyZXNjcnV6L2FuZ3VsYXItbWF0ZXJpYWxpemUpXG4gKiBJbnN0ZWFkIG9mIGFkZGluZyB0aGUgLmlucHV0LWZpZWxkIGNsYXNzIHRvIGEgZGl2IHN1cnJvdW5kaW5nIGEgbGFiZWwgYW5kIGlucHV0LCBhZGQgdGhlIGF0dHJpYnV0ZSBpbnB1dC1maWVsZC5cbiAqIFRoYXQgd2F5IGl0IHdpbGwgYWxzbyB3b3JrIHdoZW4gYW5ndWxhciBkZXN0cm95cy9yZWNyZWF0ZXMgdGhlIGVsZW1lbnRzLlxuICpcbiAqIEV4YW1wbGU6XG4gPGlucHV0ZmllbGQgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHhcIj5cbiA8bGFiZWw+e3tuYW1lfX06PC9sYWJlbD5cbiA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwie3tuYW1lfX1cIiBuZy1tb2RlbD1cInZhbHVlXCI+XG4gPC9pbnB1dGZpZWxkPlxuICovXG5hbmd1bGFyLm1vZHVsZShcInVpLm1hdGVyaWFsaXplLmlucHV0ZmllbGRcIiwgW10pXG4gICAgLmRpcmVjdGl2ZSgnaW5wdXRGaWVsZCcsIFtcIiRjb21waWxlXCIsIFwiJHRpbWVvdXRcIiwgZnVuY3Rpb24gKCRjb21waWxlLCAkdGltZW91dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgTWF0ZXJpYWxpemUudXBkYXRlVGV4dEZpZWxkcygpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZmluZCgndGV4dGFyZWEsIGlucHV0JykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGNvdW50YWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRhYmxlID0gYW5ndWxhci5lbGVtZW50KGNvdW50YWJsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvdW50YWJsZS5zaWJsaW5ncygnc3BhbltjbGFzcz1cImNoYXJhY3Rlci1jb3VudGVyXCJdJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRhYmxlLmNoYXJhY3RlckNvdW50ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IG5nLXRyYW5zY2x1ZGUgY2xhc3M9XCJpbnB1dC1maWVsZFwiPjwvZGl2PidcbiAgICAgICAgfTtcbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnanVrZScsIFtcbiAgICAnbm90aWZpY2F0aW9ucycsXG4gICAgJ292ZXJsYXknLFxuICAgICduYXZiYXInLFxuXG4gICAgLy9Vc2VyXG4gICAgJ1VzZXJNb2RlbCcsXG4gICAgJ3VzZXJMaXN0JyxcbiAgICAndXNlckxpc3RJdGVtJyxcbiAgICAnbG9naW5Nb2RhbCcsXG5cbiAgICAvL0h1YnNcbiAgICAnSHViTW9kZWwnLFxuICAgICdodWJMaXN0JyxcbiAgICAnaHViTGlzdEl0ZW0nLFxuICAgICdodWJJbmZvJyxcbiAgICAnYWRkSHViTW9kYWwnLFxuXG4gICAgLy9Tb25nc1xuICAgICdTb25nTW9kZWwnLFxuICAgICdzb25nTGlzdCcsXG4gICAgJ3NvbmdMaXN0SXRlbScsXG4gICAgJ2FkZFNvbmdNb2RhbCcsXG5cbiAgICAvL1BsYXllclxuICAgICdwbGF5ZXInLFxuICAgICd5b3V0dWJlUGxheWVyJyxcblxuICAgIC8vUGxheWxpc3RcbiAgICAncGxheWxpc3QnLFxuXG4gICAgLy9QYXJzZVxuICAgICdQYXJzZVNlcnZpY2UnLFxuXG4gICAgJ3VpLnJvdXRlcidcbl0pO1xuIiwidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdqdWtlJyk7XG5cbnZhciBnZXRIdWJzID0gZnVuY3Rpb24oSHViTW9kZWwpe1xuICAgIHJldHVybiBIdWJNb2RlbC5nZXRIdWJzKCk7XG59O1xuXG52YXIgZ2V0SHViQnlJZCA9IGZ1bmN0aW9uKEh1Yk1vZGVsLCAkc3RhdGVQYXJhbXMpe1xuICAgIHZhciBodWJJZCA9ICRzdGF0ZVBhcmFtcy5odWJJZDtcbiAgICByZXR1cm4gSHViTW9kZWwuZ2V0SHViQnlJZChodWJJZCk7XG59O1xuXG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCJodWJzXCIpO1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAvKiogSHVicyAqKi9cbiAgICAgICAgLnN0YXRlKCdodWJzJywge1xuICAgICAgICAgICAgdXJsOiBcIi9odWJzXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0aWFscy9odWJzL2h1YnNQYWdlLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IEh1YnNQYWdlQ29udHJvbGxlcixcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICBnZXRIdWJzOiBnZXRIdWJzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnaHViJywge1xuICAgICAgICAgICAgdXJsOiBcIi9odWJzLzpodWJJZFwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwicGFydGlhbHMvaHVicy9odWJQYWdlLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IEh1YlBhZ2VDb250cm9sbGVyLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIGdldEh1YkJ5SWQ6IGdldEh1YkJ5SWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAvKiogVXNlcnMgKiovXG4gICAgICAgIC5zdGF0ZSgndXNlcnMnLCB7XG4gICAgICAgICAgICB1cmw6IFwiL3VzZXJzXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0aWFscy91c2Vycy91c2Vyc1BhZ2UuaHRtbFwiLFxuICAgICAgICAgICAgY29udHJvbGxlcjogVXNlcnNQYWdlQ29udHJvbGxlcixcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAvL2dldFVzZXJzOiBnZXRVc2Vyc1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3VzZXInLCB7XG4gICAgICAgICAgICB1cmw6IFwiL3VzZXIvOmlkXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0aWFscy91c2Vycy91c2VyUGFnZS5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBVc2VyUGFnZUNvbnRyb2xsZXIsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgLy9nZXRVc2VyczogZ2V0VXNlcnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59KTtcblxuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRwcm92aWRlKSB7XG4gICAgJHByb3ZpZGUuZGVjb3JhdG9yKCckc3RhdGUnLCBmdW5jdGlvbigkZGVsZWdhdGUsICRyb290U2NvcGUpIHtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24oZXZlbnQsIHN0YXRlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgICRkZWxlZ2F0ZS5uZXh0ID0gc3RhdGU7XG4gICAgICAgICAgICAkZGVsZWdhdGUudG9QYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gJGRlbGVnYXRlO1xuICAgIH0pO1xufSk7XG5cblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkcHJvdmlkZSkge1xuICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRzdGF0ZScsIGZ1bmN0aW9uKCRkZWxlZ2F0ZSwgJHJvb3RTY29wZSkge1xuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCBzdGF0ZSwgcGFyYW1zKSB7XG4gICAgICAkZGVsZWdhdGUubmV4dCA9IHN0YXRlO1xuICAgICAgJGRlbGVnYXRlLnRvUGFyYW1zID0gcGFyYW1zO1xuICAgIH0pO1xuICAgIHJldHVybiAkZGVsZWdhdGU7XG4gIH0pO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm5hbWVzcGFjZSgnbW9kZWxzLmV2ZW50cycpLkhVQl9VUERBVEVEID0gXCJBY3Rpdml0eU1vZGVsLkhVQl9VUERBVEVEXCI7XG5uYW1lc3BhY2UoJ21vZGVscy5ldmVudHMnKS5IVUJTX1VQREFURUQgPSBcIkFjdGl2aXR5TW9kZWwuSFVCU19VUERBVEVEXCI7XG5cbnZhciBIdWJNb2RlbCA9IEV2ZW50RGlzcGF0Y2hlci5leHRlbmQoe1xuICAgIGh1YjogbnVsbCxcbiAgICBodWJzIDogW10sXG4gICAgUGFyc2VTZXJ2aWNlOm51bGwsXG4gICAgbm90aWZpY2F0aW9uczogbnVsbCxcbiAgICBjdXJyZW50U29uZzogbnVsbCxcblxuICAgIGdldEh1YnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLlBhcnNlU2VydmljZS5nZXRIdWJzKCkudGhlbihmdW5jdGlvbihodWJzKXtcbiAgICAgICAgICAgIHRoaXMuaHVicyA9IGh1YnM7XG4gICAgICAgICAgICByZXR1cm4gaHVicztcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRIdWJCeUlkOiBmdW5jdGlvbihodWJJZCl7XG4gICAgICAgIHJldHVybiB0aGlzLlBhcnNlU2VydmljZS5nZXRIdWJCeUlkKGh1YklkKS50aGVuKGZ1bmN0aW9uKGh1Yil7XG4gICAgICAgICAgICB0aGlzLmh1YiA9IGh1YjtcbiAgICAgICAgICAgIHJldHVybiBodWI7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlSHViOiBmdW5jdGlvbihodWIpe1xuICAgICAgICByZXR1cm4gdGhpcy5QYXJzZVNlcnZpY2UuY3JlYXRlSHViKGh1YikudGhlbihmdW5jdGlvbihodWIpe1xuICAgICAgICAgICAgdGhpcy5odWIgPSBodWI7XG4gICAgICAgICAgICByZXR1cm4gaHViO1xuICAgICAgICB9LmJpbmQodGhpcyksIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGFkZFNvbmdUb1BsYXlsaXN0OiBmdW5jdGlvbihzb25nKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuUGFyc2VTZXJ2aWNlLmFkZFNvbmdUb1BsYXlsaXN0KHNvbmcsIHRoaXMuaHViKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGdldFBsYXlsaXN0OiBmdW5jdGlvbigpe1xuXG4gICAgfSxcblxufSk7XG5cblxuKGZ1bmN0aW9uICgpe1xuICAgIHZhciBIdWJNb2RlbFByb3ZpZGVyID0gQ2xhc3MuZXh0ZW5kKHtcbiAgICAgICAgaW5zdGFuY2U6IG5ldyBIdWJNb2RlbCgpLFxuXG4gICAgICAgICRnZXQ6IGZ1bmN0aW9uKFBhcnNlU2VydmljZSwgTm90aWZpY2F0aW9ucyl7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlLlBhcnNlU2VydmljZSA9IFBhcnNlU2VydmljZTtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2Uubm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnM7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ0h1Yk1vZGVsJyxbXSlcbiAgICAgICAgLnByb3ZpZGVyKCdIdWJNb2RlbCcsIEh1Yk1vZGVsUHJvdmlkZXIpO1xufSgpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubmFtZXNwYWNlKCdtb2RlbHMuZXZlbnRzJykuU09OR19BRERFRCA9IFwiQWN0aXZpdHlNb2RlbC5TT05HX0FEREVEXCI7XG5uYW1lc3BhY2UoJ21vZGVscy5ldmVudHMnKS5TT05HU19GT1VORCA9IFwiQWN0aXZpdHlNb2RlbC5TT05HX0ZPVU5EXCI7XG5cblxudmFyIFNvbmdNb2RlbCA9IEV2ZW50RGlzcGF0Y2hlci5leHRlbmQoe1xuICAgIHNvbmc6IG51bGwsXG4gICAgc29uZ3M6IFtdLFxuICAgIHBsYXlpbmdTb25nOiBudWxsLFxuICAgIG5leHRTb25nOiBudWxsLFxuICAgIHF1ZXVlZFNvbmdzOiBbXSxcbiAgICBmb3VuZFNvbmdzOiBbXSxcbiAgICBQYXJzZVNlcnZpY2U6bnVsbCxcbiAgICBub3RpZmljYXRpb25zOiBudWxsLFxuXG4gICAgZ2V0TmV4dFNvbmc6IGZ1bmN0aW9uKGh1YklkKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuUGFyc2VTZXJ2aWNlLmdldE5leHRTb25nKGh1YklkKS50aGVuKGZ1bmN0aW9uKHNvbmcpe1xuICAgICAgICAgICAgdGhpcy5uZXh0U29uZyA9IHNvbmc7XG4gICAgICAgICAgICByZXR1cm4gc29uZztcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBmaW5kU29uZ3M6IGZ1bmN0aW9uKHNlYXJjaFBhcmFtcyl7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRZb3VUdWJlU29uZ3Moc2VhcmNoUGFyYW1zKTtcbiAgICB9LFxuXG4gICAgZmluZFlvdVR1YmVTb25nczogZnVuY3Rpb24oc2VhcmNoUGFyYW1zKXtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gdGhpcy4kcS5kZWZlcigpO1xuICAgICAgICB2YXIgcmVxdWVzdCA9IGdhcGkuY2xpZW50LnlvdXR1YmUuc2VhcmNoLmxpc3Qoe1xuICAgICAgICAgICAgcTogc2VhcmNoUGFyYW1zLnRleHQsXG4gICAgICAgICAgICBtYXhSZXN1bHRzOiAxMCxcbiAgICAgICAgICAgIHBhcnQ6ICdzbmlwcGV0J1xuICAgICAgICB9KTtcblxuICAgICAgICByZXF1ZXN0LmV4ZWN1dGUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VZb3VUdWJlU29uZ3MocmVzcG9uc2UuaXRlbXMpO1xuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5vdGlmeShtb2RlbHMuZXZlbnRzLlNPTkdTX0ZPVU5EKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9LmJpbmQodGhpcyksIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuXG4gICAgcGFyc2VZb3VUdWJlU29uZ3M6IGZ1bmN0aW9uKHNvbmdzKXtcbiAgICAgICAgc29uZ3MuZm9yRWFjaChmdW5jdGlvbihzb25nKXtcbiAgICAgICAgICAgIHRoaXMuZm91bmRTb25ncy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInlvdXR1YmVcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogc29uZy5zbmlwcGV0LnRpdGxlLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBzb25nLnNuaXBwZXQuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgdGh1bWJuYWlsOiBzb25nLnNuaXBwZXQudGh1bWJuYWlscy5kZWZhdWx0LnVybCxcbiAgICAgICAgICAgICAgICB5b3V0dWJlSWQ6IHNvbmcuaWQudmlkZW9JZCxcbiAgICAgICAgICAgICAgICBjcmVhdGVkQXQ6IHNvbmcuc25pcHBldC5wdWJsaXNoZWRBdFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG59KTtcblxuXG4oZnVuY3Rpb24gKCl7XG4gICAgdmFyIFNvbmdNb2RlbFByb3ZpZGVyID0gQ2xhc3MuZXh0ZW5kKHtcbiAgICAgICAgaW5zdGFuY2U6IG5ldyBTb25nTW9kZWwoKSxcblxuICAgICAgICAkZ2V0OiBmdW5jdGlvbigkcSwgUGFyc2VTZXJ2aWNlLCBOb3RpZmljYXRpb25zKXtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuJHEgPSAkcTtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuUGFyc2VTZXJ2aWNlID0gUGFyc2VTZXJ2aWNlO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5ub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucztcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnU29uZ01vZGVsJyxbXSlcbiAgICAgICAgLnByb3ZpZGVyKCdTb25nTW9kZWwnLCBTb25nTW9kZWxQcm92aWRlcik7XG59KCkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5uYW1lc3BhY2UoJ21vZGVscy5ldmVudHMnKS5VU0VSX1NJR05FRF9JTiA9IFwiQWN0aXZpdHlNb2RlbC5VU0VSX1NJR05FRF9JTlwiO1xubmFtZXNwYWNlKCdtb2RlbHMuZXZlbnRzJykuVVNFUl9TSUdORURfT1VUID0gXCJBY3Rpdml0eU1vZGVsLlVTRVJfU0lHTkVEX09VVFwiO1xubmFtZXNwYWNlKCdtb2RlbHMuZXZlbnRzJykuVVNFUl9VUERBVEVEID0gXCJBY3Rpdml0eU1vZGVsLlVTRVJfVVBEQVRFRFwiO1xuXG5uYW1lc3BhY2UoJ21vZGVscy5ldmVudHMnKS5VU0VSU19GRVRDSEVEID0gXCJBY3Rpdml0eU1vZGVsLlVTRVJTX0ZFVENIRURcIjtcblxubmFtZXNwYWNlKCdtb2RlbHMuZXZlbnRzJykuUFJPRklMRV9MT0FERUQgPSBcIkFjdGl2aXR5TW9kZWwuUFJPRklMRV9MT0FERURcIjtcbm5hbWVzcGFjZSgnbW9kZWxzLmV2ZW50cycpLkFVVEhfRVJST1IgPSBcIkFjdGl2aXR5TW9kZWwuQVVUSF9FUlJPUlwiO1xubmFtZXNwYWNlKCdtb2RlbHMuZXZlbnRzJykuTkVUV09SS19FUlJPUiA9IFwiQWN0aXZpdHlNb2RlbC5ORVRXT1JLX0VSUk9SXCI7XG5cbnZhciBVc2VyTW9kZWwgPSBFdmVudERpc3BhdGNoZXIuZXh0ZW5kKHtcbiAgICBjdXJyZW50VXNlcjogbnVsbCxcbiAgICB1c2VyczogbnVsbCxcbiAgICBQYXJzZVNlcnZpY2U6bnVsbCxcbiAgICBub3RpZmljYXRpb25zOiBudWxsLFxuXG4gICAgbG9naW46IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCl7XG4gICAgICAgIHJldHVybiB0aGlzLlBhcnNlU2VydmljZS5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5ub3RpZnkobW9kZWxzLmV2ZW50cy5VU0VSX1NJR05FRF9JTik7XG4gICAgICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHNpZ25VcDogZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuUGFyc2VTZXJ2aWNlLnNpZ25VcCh1c2VybmFtZSwgcGFzc3dvcmQpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5ub3RpZnkobW9kZWxzLmV2ZW50cy5VU0VSX1NJR05FRF9JTik7XG4gICAgICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIHNpZ25PdXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLlBhcnNlU2VydmljZS5zaWduT3V0KCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5vdGlmeShtb2RlbHMuZXZlbnRzLlVTRVJfU0lHTkVEX09VVCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB1cGRhdGVVc2VyOiBmdW5jdGlvbih1c2VyKXtcblxuICAgIH0sXG5cbiAgICBnZXRVc2VyczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuUGFyc2VTZXJ2aWNlLmdldFVzZXJzKCkudGhlbihmdW5jdGlvbihyZXN1bHRzKXtcbiAgICAgICAgICAgIHRoaXMudXNlcnMgPSByZXN1bHRzO1xuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5vdGlmeShtb2RlbHMuZXZlbnRzLlVTRVJTX0ZFVENIRUQpO1xuICAgICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMocmVzdWx0cyk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGdldFVzZXJCeUlkOiBmdW5jdGlvbihpZCl7XG4gICAgICAgIHJldHVybiB0aGlzLlBhcnNlU2VydmljZS5nZXRVc2VyQnlJZChpZCkudGhlbihmdW5jdGlvbihyZXN1bHRzKXtcbiAgICAgICAgICAgIHRoaXMucHJvZmlsZSA9IHJlc3VsdHM7XG4gICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuUFJPRklMRV9MT0FERUQpO1xuICAgICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMocmVzdWx0cyk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGdldFVzZXJzRm9yR3ltOmZ1bmN0aW9uKGd5bSl7XG4gICAgICAgIHJldHVybiB0aGlzLlBhcnNlU2VydmljZS5nZXRVc2Vyc0Zvckd5bShneW0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0cyl7XG4gICAgICAgICAgICB0aGlzLnVzZXJzID0gcmVzdWx0cztcbiAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5ub3RpZnkobW9kZWxzLmV2ZW50cy5VU0VSU19GRVRDSEVEKTtcbiAgICAgICAgICAgIHJldHVybiBQYXJzZS5Qcm9taXNlLmFzKHJlc3VsdHMpO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBnZXRVc2Vyc0FuZFN0YXRzRm9yR3ltOmZ1bmN0aW9uKGd5bSl7XG4gICAgICAgIHJldHVybiB0aGlzLlBhcnNlU2VydmljZS5nZXRVc2Vyc0FuZFN0YXRzRm9yR3ltKGd5bSkudGhlbihmdW5jdGlvbihyZXN1bHRzKXtcbiAgICAgICAgICAgIHRoaXMudXNlcnMgPSByZXN1bHRzO1xuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5vdGlmeShtb2RlbHMuZXZlbnRzLlVTRVJTX0ZFVENIRUQpO1xuICAgICAgICAgICAgcmV0dXJuIFBhcnNlLlByb21pc2UuYXMocmVzdWx0cyk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIGdldE5ld1VzZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB1c2VyID0gbmV3IFBhcnNlLlVzZXIoKTtcblxuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICB9LFxuXG4gICAgY3JlYXRlVXNlcjogZnVuY3Rpb24odXNlcil7XG4gICAgICAgIHJldHVybiB0aGlzLlBhcnNlU2VydmljZS5jcmVhdGVVc2VyKHVzZXIpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVVc2VyOiBmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgcmV0dXJuIFBhcnNlLkNsb3VkLnJ1bigndXBkYXRlVXNlcicse1xuICAgICAgICAgICAgdXNlcklkOiB1c2VyLmlkLFxuICAgICAgICAgICAgZ3ltSWQ6IHVzZXIuYXR0cmlidXRlcy5jdXJyZW50R3ltLmlkLFxuICAgICAgICAgICAgZW1haWw6IHVzZXIuYXR0cmlidXRlcy5lbWFpbCxcbiAgICAgICAgICAgIHNldHRlcjogdXNlci5hdHRyaWJ1dGVzLnNldHRlcixcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VyLmF0dHJpYnV0ZXMudXNlcm5hbWVcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldFNldHRlcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLlBhcnNlU2VydmljZS5nZXRTZXR0ZXJzKCkudGhlbihmdW5jdGlvbihyZXN1bHRzKXtcbiAgICAgICAgICAgIHRoaXMuc2V0dGVycyA9IHJlc3VsdHM7XG4gICAgICAgICAgICByZXR1cm4gUGFyc2UuUHJvbWlzZS5hcyhyZXN1bHRzKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbn0pO1xuXG5cbihmdW5jdGlvbiAoKXtcbiAgICB2YXIgVXNlck1vZGVsUHJvdmlkZXIgPSBDbGFzcy5leHRlbmQoe1xuICAgICAgICBpbnN0YW5jZTogbmV3IFVzZXJNb2RlbCgpLFxuXG4gICAgICAgICRnZXQ6IGZ1bmN0aW9uKFBhcnNlU2VydmljZSwgTm90aWZpY2F0aW9ucyl7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlLlBhcnNlU2VydmljZSA9IFBhcnNlU2VydmljZTtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2Uubm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnM7XG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlLmN1cnJlbnRVc2VyID0gUGFyc2UuVXNlci5jdXJyZW50KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1VzZXJNb2RlbCcsW10pXG4gICAgICAgIC5wcm92aWRlcignVXNlck1vZGVsJywgVXNlck1vZGVsUHJvdmlkZXIpO1xufSgpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFBhcnNlU2VydmljZSA9IENsYXNzLmV4dGVuZCh7XG5cbiAgICBIdWI6IFBhcnNlLk9iamVjdC5leHRlbmQoXCJIdWJcIiksXG4gICAgU29uZzogUGFyc2UuT2JqZWN0LmV4dGVuZChcIlNvbmdcIiksXG4gICAgUXVldWVkU29uZzogUGFyc2UuT2JqZWN0LmV4dGVuZChcIlF1ZXVlZFNvbmdcIiksXG4gICAgSHViQUNMOiBuZXcgUGFyc2UuQUNMKCksXG4gICAgU29uZ0FDTDogbmV3IFBhcnNlLkFDTCgpLFxuICAgIFF1ZXVlZFNvbmdBQ0w6IG5ldyBQYXJzZS5BQ0woKSxcblxuICAgIC8qKioqIHV0aWwgKioqKi9cbiAgICBnZW5SYW5kb21QYXNzOmZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzdHJpbmcgPSAncGFzc3dvcmQnO1xuICAgICAgICBmb3IodmFyIGk9MDtpPDEwO2krKyl7XG4gICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcrKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDkpICsgMSkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH0sXG5cbiAgICAvKioqKiBVc2VycyAqKioqL1xuICAgIGxvZ2luOiBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpe1xuICAgICAgICByZXR1cm4gUGFyc2UuVXNlci5sb2dJbih1c2VybmFtZSwgcGFzc3dvcmQsIHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24odXNlciwgZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2lnbk91dDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIubG9nT3V0KCk7XG4gICAgfSxcblxuICAgIHNpZ25VcDogZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKXtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuc2lnblVwKHVzZXJuYW1lLCBwYXNzd29yZCwge1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih1c2VyLCBlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvL0NSRUFURVxuICAgIGNyZWF0ZVVzZXI6IGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICByZXR1cm4gUGFyc2UuQ2xvdWQucnVuKCdjcmVhdGVVc2VyJyx1c2VyKTtcbiAgICB9LFxuXG4gICAgLy9VUERBVEVcbiAgICB1cGRhdGVVc2VyOiBmdW5jdGlvbih1c2VyKXtcblxuICAgIH0sXG5cbiAgICAvL1JFQURcbiAgICBnZXRDdXJyZW50VXNlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIFBhcnNlLlVzZXIuY3VycmVudCgpO1xuICAgIH0sXG5cbiAgICAvL1JFQURcbiAgICBnZXRVc2VyczogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFBhcnNlLlVzZXIpO1xuICAgICAgICByZXR1cm4gcXVlcnkuZmluZCgpO1xuICAgIH0sXG5cbiAgICAvL1JFQURcbiAgICBnZXRVc2VyQnlJZDogZnVuY3Rpb24oaWQpe1xuICAgICAgICB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoXCJVc2VyXCIpO1xuICAgICAgICBxdWVyeS5pbmNsdWRlKCdjdXJyZW50R3ltJyk7XG4gICAgICAgIHJldHVybiBxdWVyeS5nZXQoaWQpO1xuICAgIH0sXG5cbiAgICAvL0RFTEVURVxuICAgIGRlbGV0VXNlcjogZnVuY3Rpb24odXNlcklkKXtcbiAgICAgICAgcmV0dXJuIFBhcnNlLkNsb3VkLnJ1bignZGVsZXRlVXNlcicsIHVzZXJJZCk7XG4gICAgfSxcblxuICAgIC8qKiBIdWJzICoqL1xuXG4gICAgLy9DUkVBVEVcbiAgICBjcmVhdGVIdWI6IGZ1bmN0aW9uKGh1Yil7XG4gICAgICAgIHZhciBuZXdIdWIgPSBuZXcgdGhpcy5IdWIoKTtcbiAgICAgICAgbmV3SHViLnNldChcIm5hbWVcIiwgaHViLm5hbWUpO1xuICAgICAgICBuZXdIdWIuc2V0KFwicGFzc3dvcmRcIiwgaHViLnBhc3N3b3JkKTtcbiAgICAgICAgbmV3SHViLnNldChcInR5cGVcIiwgXCJ3ZWJcIik7XG4gICAgICAgIG5ld0h1Yi5zZXQoXCJvd25lclwiLCBQYXJzZS5Vc2VyLmN1cnJlbnQoKSk7XG4gICAgICAgIHJldHVybiBuZXdIdWIuc2F2ZShudWxsLCB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihuZXdIdWIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXdIdWI7XG4gICAgICAgICAgICB9LCBlcnJvcjogZnVuY3Rpb24obmV3SHViLCBlcnJvcil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy9VUERBVEVcbiAgICB1cGRhdGVIdWI6IGZ1bmN0aW9uKCl7XG5cbiAgICB9LFxuXG4gICAgLy9SRUFEXG4gICAgZ2V0SHViczogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFwiSHViXCIpO1xuICAgICAgICBxdWVyeS5pbmNsdWRlKFwib3duZXJcIik7XG4gICAgICAgIHJldHVybiBxdWVyeS5maW5kKHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGh1YnMpe1xuICAgICAgICAgICAgICAgIHJldHVybiBodWJzO1xuICAgICAgICAgICAgfSwgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvL1JFQURcbiAgICBnZXRIdWJCeUlkOiBmdW5jdGlvbihpZCl7XG4gICAgICAgIHZhciBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIkh1YlwiKTtcbiAgICAgICAgcXVlcnkuaW5jbHVkZShcIm93bmVyXCIpO1xuICAgICAgICByZXR1cm4gcXVlcnkuZ2V0KGlkLCB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihodWIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBodWI7XG4gICAgICAgICAgICB9LCBlcnJvcjogZnVuY3Rpb24oaHViLCBlcnJvcil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy9ERUxFVEVcbiAgICBkZWxldGVIdWI6IGZ1bmN0aW9uKGh1YklkKXtcbiAgICAgICAgcmV0dXJuIFBhcnNlLkNsb3VkLnJ1bignZGVsZXRlSHViJywge2h1YklkOiBodWJJZCwgdXNlcklkOiBQYXJzZS5Vc2VyLmN1cnJlbnQoKS5pZH0pO1xuICAgIH0sXG5cbiAgICAvKiogU09OR1MgKiovXG5cbiAgICAvL0FkZCBTb25nXG4gICAgYWRkU29uZ1RvUGxheWxpc3Q6IGZ1bmN0aW9uKHNvbmcsIGh1Yil7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IHRoaXMuJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIHF1ZXVlZFNvbmcgPSBuZXcgdGhpcy5RdWV1ZWRTb25nKCk7XG4gICAgICAgIHF1ZXVlZFNvbmcuc2V0KFwiYWRkZWRCeVwiLCBQYXJzZS5Vc2VyLmN1cnJlbnQoKSk7XG4gICAgICAgIHF1ZXVlZFNvbmcuc2V0KFwiaHViXCIsIGh1Yik7XG4gICAgICAgIHF1ZXVlZFNvbmcuc2V0KFwidGl0bGVcIiwgc29uZy50aXRsZSk7XG4gICAgICAgIHF1ZXVlZFNvbmcuc2V0KFwidGh1bWJuYWlsXCIsIHNvbmcudGh1bWJuYWlsKTtcbiAgICAgICAgcXVldWVkU29uZy5zZXQoXCJkZXNjcmlwdGlvblwiLCBzb25nLmRlc2NyaXB0aW9uKTtcbiAgICAgICAgcXVldWVkU29uZy5zZXQoXCJ0eXBlXCIsIHNvbmcudHlwZSk7XG4gICAgICAgIHF1ZXVlZFNvbmcuc2V0KFwieW91dHViZUlkXCIsIHNvbmcueW91dHViZUlkKTtcbiAgICAgICAgcXVldWVkU29uZy5zZXQoXCJzb25nQ3JlYXRlZEF0XCIsIHNvbmcuY3JlYXRlZEF0KTtcblxuICAgICAgICBxdWV1ZWRTb25nLnNhdmUobnVsbCwge1xuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICB9LCBlcnJvcjogZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuXG4gICAgICAgIC8vRm9yIFNvbmcgYW5hbHl0aWNzXG4gICAgICAgIC8qXG4gICAgICAgIHZhciBxdWVyeSA9IG5ldyBQYXJzZS5RdWVyeShcIlNvbmdcIik7XG4gICAgICAgIGlmKHNvbmcudHlwZSA9PSAneW91dHViZScpe1xuICAgICAgICAgICAgcXVlcnkuZXF1YWxUbyhcInR5cGVcIiwgXCJ5b3V0dWJlXCIpO1xuICAgICAgICAgICAgcXVlcnkuZXF1YWxUbyhcInlvdXR1YmVJZFwiLCBzb25nLnlvdXR1YmVJZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycm9yLCBkb24ndCBrbm93IHR5cGUgb2Ygc29uZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHF1ZXJ5LmZpcnN0KHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAgICAgaWYocmVzdWx0LmlkKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNldChcInBsYXlDb3VudFwiLCByZXN1bHQuZ2V0KFwiYWRkQ291bnRcIikgKyAxKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL2NyZWF0ZSBuZXcgU29uZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGVycm9yOiBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICAqL1xuXG5cbiAgICAgICAgLy9OZWVkcyB0byBiZSBpbiB0aGUgY2xvdWQgZXZlbnR1YWxseVxuICAgICAgICAvL3JldHVybiBQYXJzZS5DbG91ZC5ydW4oJ2FkZFNvbmdUb1BsYXlsaXN0Jywge3Nvbmc6IEpTT04uc3RyaW5naWZ5KHNvbmcpLCBodWI6IGh1Yi50b0pTT04oKSwgdXNlcklkOiBQYXJzZS5Vc2VyLmN1cnJlbnQoKS5pZCB9KTtcbiAgICB9XG5cbn0pO1xuXG4oZnVuY3Rpb24oKXtcbiAgICB2YXIgUGFyc2VTZXJ2aWNlUHJvdmlkZXIgPSBDbGFzcy5leHRlbmQoe1xuICAgICAgICBpbnN0YW5jZTpuZXcgUGFyc2VTZXJ2aWNlKCksXG4gICAgICAgICRnZXQ6IGZ1bmN0aW9uKCRxKXtcblxuICAgICAgICAgICAgUGFyc2UuaW5pdGlhbGl6ZShcIkdVOER1T1A2UnpsbkZGTkJOT1ZuQjVxcmY2SENxeHBKWFNiRHlOM1dcIiwgXCJXZjZ0MzZoeU43YVBia1F6SXhONmJYUE1aR2xyNHhwZFpnSzFsandHXCIpO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS4kcSA9ICRxO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5IdWJBQ0wuc2V0UHVibGljUmVhZEFjY2Vzcyh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuSHViQUNMLnNldFB1YmxpY1dyaXRlQWNjZXNzKGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuU29uZ0FDTC5zZXRQdWJsaWNSZWFkQWNjZXNzKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5Tb25nQUNMLnNldFB1YmxpY1dyaXRlQWNjZXNzKGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UuUXVldWVkU29uZ0FDTC5zZXRQdWJsaWNSZWFkQWNjZXNzKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZS5RdWV1ZWRTb25nQUNMLnNldFB1YmxpY1dyaXRlQWNjZXNzKGZhbHNlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdQYXJzZVNlcnZpY2UnLFtdKVxuICAgICAgICAucHJvdmlkZXIoJ1BhcnNlU2VydmljZScsIFBhcnNlU2VydmljZVByb3ZpZGVyKTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm5hbWVzcGFjZSgnbW9kZWxzLmV2ZW50cycpLkJSQU5EX0NIQU5HRSA9IFwiQWN0aXZpdHlNb2RlbC5CUkFORF9DSEFOR0VcIjtcblxudmFyIE5hdkJhckRpcmVjdGl2ZSA9IEJhc2VEaXJlY3RpdmUuZXh0ZW5kKHtcbiAgICB1c2VyTW9kZWw6IG51bGwsXG4gICAgbm90aWZpY2F0aW9uczogbnVsbCxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkdGltZW91dCwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCl7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgICAgIHRoaXMuJHN0YXRlID0gJHN0YXRlO1xuICAgICAgICB0aGlzLiR0aW1lb3V0ID0gJHRpbWVvdXQ7XG4gICAgICAgIHRoaXMudXNlck1vZGVsID0gVXNlck1vZGVsO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zO1xuICAgICAgICB0aGlzLmh1Yk1vZGVsID0gSHViTW9kZWw7XG4gICAgfSxcblxuICAgIGRlZmluZUxpc3RlbmVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLmFkZEV2ZW50TGlzdGVuZXIobW9kZWxzLmV2ZW50cy5VU0VSX1NJR05FRF9JTiwgdGhpcy5vblVzZXJTaWduZWRJbi5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLmFkZEV2ZW50TGlzdGVuZXIobW9kZWxzLmV2ZW50cy5VU0VSX1NJR05FRF9PVVQsIHRoaXMub25Vc2VyU2lnbmVkT3V0LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihtb2RlbHMuZXZlbnRzLkJSQU5EX0NIQU5HRSwgdGhpcy5vbkJyYW5kQ2hhbmdlLmJpbmQodGhpcykpO1xuXG4gICAgfSxcblxuICAgIGRlZmluZVNjb3BlOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRzY29wZS5jdXJyZW50VXNlciA9IHRoaXMudXNlck1vZGVsLmN1cnJlbnRVc2VyO1xuICAgICAgICB0aGlzLiRzY29wZS5zaWduT3V0ID0gdGhpcy5zaWduT3V0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuJHNjb3BlLm9wZW5BZGRIdWJNb2RhbCA9IHRoaXMub3BlbkFkZEh1Yk1vZGFsLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuJHNjb3BlLm9wZW5Mb2dpbk1vZGFsID0gdGhpcy5vcGVuTG9naW5Nb2RhbC5iaW5kKHRoaXMpO1xuXG4gICAgICAgICQoXCIudXNlckRyb3Bkb3duQnV0dG9uXCIpLmRyb3Bkb3duKCk7XG4gICAgICAgICQoXCIuYnV0dG9uLWNvbGxhcHNlXCIpLnNpZGVOYXYoKTtcbiAgICB9LFxuXG4gICAgb3BlbkFkZEh1Yk1vZGFsOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuT1BFTl9BRERfSFVCX01PREFMKTtcbiAgICB9LFxuXG4gICAgb3BlbkxvZ2luTW9kYWw6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5ub3RpZnkobW9kZWxzLmV2ZW50cy5PUEVOX0xPR0lOX01PREFMKTtcbiAgICB9LFxuXG4gICAgc2lnbk91dDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5vdGlmeShtb2RlbHMuZXZlbnRzLlNIT1dfTE9BRElORyk7XG4gICAgICAgIHRoaXMudXNlck1vZGVsLnNpZ25PdXQoKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuSElERV9MT0FESU5HKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9uVXNlclNpZ25lZEluOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRzY29wZS5jdXJyZW50VXNlciA9IHRoaXMudXNlck1vZGVsLmN1cnJlbnRVc2VyO1xuICAgICAgICAkKFwiLmRyb3Bkb3duLWJ1dHRvblwiKS5kcm9wZG93bigpO1xuICAgIH0sXG5cbiAgICBvblVzZXJTaWduZWRPdXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHNjb3BlLmN1cnJlbnRVc2VyID0gdGhpcy51c2VyTW9kZWwuY3VycmVudFVzZXI7XG4gICAgfSxcblxuXG4gICAgb25CcmFuZENoYW5nZTogZnVuY3Rpb24oZXZlbnQsIGJyYW5kKXtcbiAgICAgICAgdGhpcy4kc2NvcGUuYnJhbmQgPSBicmFuZDtcbiAgICB9XG5cbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmF2YmFyJyxbXSlcbiAgICAuZGlyZWN0aXZlKCduYXZiYXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsICR0aW1lb3V0LCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OidFJyxcbiAgICAgICAgICAgIGlzb2xhdGU6dHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgICAgICAgICAgICAgbmV3IE5hdkJhckRpcmVjdGl2ZSgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsIFVzZXJNb2RlbCwgTm90aWZpY2F0aW9ucywgSHViTW9kZWwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNjb3BlOnRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0aWFscy9uYXZiYXIvbmF2YmFyLmh0bWxcIlxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xubmFtZXNwYWNlKCdtb2RlbHMuZXZlbnRzJykuU0hPV19MT0FESU5HID0gXCJBY3Rpdml0eU1vZGVsLlNIT1dfTE9BRElOR1wiO1xubmFtZXNwYWNlKCdtb2RlbHMuZXZlbnRzJykuSElERV9MT0FESU5HID0gXCJBY3Rpdml0eU1vZGVsLkhJREVfTE9BRElOR1wiO1xuXG52YXIgT3ZlcmxheURpcmVjdGl2ZSA9IEJhc2VEaXJlY3RpdmUuZXh0ZW5kKHtcbiAgICBub3RpZmljYXRpb25zOiBudWxsLFxuXG4gICAgaW5pdDogZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCBOb3RpZmljYXRpb25zKXtcbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucztcbiAgICAgICAgdGhpcy5fc3VwZXIoJHNjb3BlKTtcbiAgICB9LFxuXG4gICAgZGVmaW5lTGlzdGVuZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihtb2RlbHMuZXZlbnRzLlNIT1dfTE9BRElORywgdGhpcy5oYW5kbGVTaG93TG9hZGluZy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLmFkZEV2ZW50TGlzdGVuZXIobW9kZWxzLmV2ZW50cy5ISURFX0xPQURJTkcsIHRoaXMuaGFuZGxlSGlkZUxvYWRpbmcuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy4kcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XG4gICAgICAgICAgICB0aGlzLiRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIH0sXG5cbiAgICBkZWZpbmVTY29wZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgfSxcblxuICAgIC8qKiBFVkVOVCBIQU5ETEVSUyAqKi9cbiAgICBoYW5kbGVTaG93TG9hZGluZzogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICB0aGlzLiRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgaWYoIXRoaXMuJHNjb3BlLiQkcGhhc2UpIHtcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGhhbmRsZUhpZGVMb2FkaW5nOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHRoaXMuJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYoIXRoaXMuJHNjb3BlLiQkcGhhc2UpIHtcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLiRhcHBseSgpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdvdmVybGF5JyxbXSlcbiAgICAuZGlyZWN0aXZlKCdvdmVybGF5JywgZnVuY3Rpb24oJHJvb3RTY29wZSwgTm90aWZpY2F0aW9ucyl7XG5cdHJldHVybiB7XG5cdCAgICByZXN0cmljdDonRScsXG5cdCAgICBpc29sYXRlOnRydWUsXG5cdCAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUpe1xuXHRcdG5ldyBPdmVybGF5RGlyZWN0aXZlKCRzY29wZSwgJHJvb3RTY29wZSwgTm90aWZpY2F0aW9ucyk7XG5cdCAgICB9LFxuXHQgICAgc2NvcGU6dHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInBhcnRpYWxzL292ZXJsYXkvb3ZlcmxheS5odG1sXCJcblx0fTtcbiAgICB9KTtcbiIsIid1c2Ugc3RyaWN0Jztcbm5hbWVzcGFjZSgnbW9kZWxzLmV2ZW50cycpLlBMQVlJTkcgPSBcIkFjdGl2aXR5TW9kZWwuUExBWUlOR1wiO1xubmFtZXNwYWNlKCdtb2RlbHMuZXZlbnRzJykuU1RPUFBFRCA9IFwiQWN0aXZpdHlNb2RlbC5TVE9QUEVEXCI7XG5uYW1lc3BhY2UoJ21vZGVscy5ldmVudHMnKS5ORVhUX1NPTkcgPSBcIkFjdGl2aXR5TW9kZWwuTkVYVF9TT05HXCI7XG5uYW1lc3BhY2UoJ21vZGVscy5ldmVudHMnKS5TT05HU19MT0FERUQgPSBcIkFjdGl2aXR5TW9kZWwuU09OR1NfTE9BREVEXCI7XG5cbnZhciBQbGF5ZXJEaXJlY3RpdmUgPSBCYXNlRGlyZWN0aXZlLmV4dGVuZCh7XG4gICAgbm90aWZpY2F0aW9uczogbnVsbCxcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgTm90aWZpY2F0aW9ucyl7XG4gICAgICAgIHRoaXMuJHJvb3RTY29wZSA9ICRyb290U2NvcGU7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnM7XG4gICAgICAgIHRoaXMuX3N1cGVyKCRzY29wZSk7XG4gICAgfSxcblxuICAgIGRlZmluZUxpc3RlbmVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgZGVmaW5lU2NvcGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaGlcIik7XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdwbGF5ZXInLFtdKVxuICAgIC5kaXJlY3RpdmUoJ3BsYXllcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsIE5vdGlmaWNhdGlvbnMpe1xuXHRyZXR1cm4ge1xuXHQgICAgcmVzdHJpY3Q6J0UnLFxuXHQgICAgaXNvbGF0ZTp0cnVlLFxuXHQgICAgbGluazogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRuZXcgUGxheWVyRGlyZWN0aXZlKCRzY29wZSwgJHJvb3RTY29wZSwgTm90aWZpY2F0aW9ucyk7XG5cdCAgICB9LFxuXHQgICAgc2NvcGU6dHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInBhcnRpYWxzL3BsYXllci9wbGF5ZXIuaHRtbFwiXG5cdH07XG4gICAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQbGF5bGlzdERpcmVjdGl2ZSA9IEJhc2VEaXJlY3RpdmUuZXh0ZW5kKHtcbiAgICBodWJNb2RlbDogbnVsbCxcbiAgICBzb25nTW9kZWw6IG51bGwsXG4gICAgbm90aWZpY2F0aW9uczogbnVsbCxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsLCBTb25nTW9kZWwpe1xuICAgICAgICB0aGlzLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgdGhpcy51c2VyTW9kZWwgPSBVc2VyTW9kZWw7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnM7XG4gICAgICAgIHRoaXMuaHViTW9kZWwgPSBIdWJNb2RlbDtcbiAgICAgICAgdGhpcy5zb25nTW9kZWwgPSBTb25nTW9kZWw7XG4gICAgfSxcblxuICAgIGRlZmluZUxpc3RlbmVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgZGVmaW5lU2NvcGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuJHNjb3BlLmh1YiA9IHRoaXMuaHViTW9kZWwuaHViO1xuICAgICAgICB0aGlzLiRzY29wZS5jdXJyZW50U29uZyA9IHt9O1xuICAgIH0sXG5cbiAgICBkZXN0cm95OiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuXG4gICAgfSxcblxuXG5cbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgncGxheWxpc3QnLFtdKVxuICAgIC5kaXJlY3RpdmUoJ3BsYXlsaXN0JywgZnVuY3Rpb24oJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsLCBTb25nTW9kZWwpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6J0UnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgICAgICAgICBuZXcgUGxheWxpc3REaXJlY3RpdmUoJHNjb3BlLCAkc3RhdGUsIFVzZXJNb2RlbCwgTm90aWZpY2F0aW9ucywgSHViTW9kZWwsIFNvbmdNb2RlbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0aWFscy9wbGF5bGlzdC9wbGF5bGlzdC5odG1sXCJcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFBsYXlsaXN0SXRlbURpcmVjdGl2ZSA9IEJhc2VEaXJlY3RpdmUuZXh0ZW5kKHtcbiAgICBodWJNb2RlbDogbnVsbCxcbiAgICBzb25nTW9kZWw6IG51bGwsXG4gICAgbm90aWZpY2F0aW9uczogbnVsbCxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsKXtcbiAgICAgICAgdGhpcy4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgIHRoaXMudXNlck1vZGVsID0gVXNlck1vZGVsO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zO1xuICAgICAgICB0aGlzLmh1Yk1vZGVsID0gSHViTW9kZWw7XG4gICAgfSxcblxuICAgIGRlZmluZUxpc3RlbmVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgZGVmaW5lU2NvcGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG5cbiAgICB9LFxuXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG5cbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgncGxheWxpc3RJdGVtJyxbXSlcbiAgICAuZGlyZWN0aXZlKCdwbGF5bGlzdEl0ZW0nLCBmdW5jdGlvbigkc3RhdGUsIFVzZXJNb2RlbCwgTm90aWZpY2F0aW9ucywgSHViTW9kZWwpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6J0UnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgICAgICAgICBuZXcgUGxheWxpc3RJdGVtRGlyZWN0aXZlKCRzY29wZSwgJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzY29wZTpmYWxzZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInBhcnRpYWxzL3BsYXlsaXN0L3BsYXlsaXN0SXRlbS5odG1sXCJcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcblxubmFtZXNwYWNlKCdtb2RlbHMuZXZlbnRzJykuT1BFTl9BRERfSFVCX01PREFMID0gXCJBY3Rpdml0eU1vZGVsLk9QRU5fQUREX0hVQl9NT0RBTFwiO1xuXG52YXIgQWRkSHViTW9kYWxEaXJlY3RpdmUgPSBCYXNlRGlyZWN0aXZlLmV4dGVuZCh7XG4gICAgaHViTW9kZWw6IG51bGwsXG4gICAgbm90aWZpY2F0aW9uczogbnVsbCxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsKXtcbiAgICAgICAgdGhpcy4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgIHRoaXMudXNlck1vZGVsID0gVXNlck1vZGVsO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zO1xuICAgICAgICB0aGlzLmh1Yk1vZGVsID0gSHViTW9kZWw7XG4gICAgfSxcblxuICAgIGRlZmluZUxpc3RlbmVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5vbk9wZW5Nb2RhbCA9IHRoaXMub25PcGVuTW9kYWwuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLmFkZEV2ZW50TGlzdGVuZXIobW9kZWxzLmV2ZW50cy5PUEVOX0FERF9IVUJfTU9EQUwsIHRoaXMub25PcGVuTW9kYWwpO1xuICAgIH0sXG5cbiAgICBkZWZpbmVTY29wZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy4kc2NvcGUuY3JlYXRlSHViID0gdGhpcy5jcmVhdGVIdWIuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy4kc2NvcGUuaHViID0ge307XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5yZW1vdmVFdmVudExpc3RlbmVyKG1vZGVscy5ldmVudHMuT1BFTl9BRERfSFVCX01PREFMLCB0aGlzLm9uT3Blbk1vZGFsKTtcbiAgICB9LFxuXG4gICAgb25PcGVuTW9kYWw6IGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyNhZGRIdWJNb2RhbCcpLm9wZW5Nb2RhbCgpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVIdWI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY3JlYXRlSHViXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLiRzY29wZS5odWIpO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuU0hPV19MT0FESU5HKTtcbiAgICAgICAgdGhpcy5odWJNb2RlbC5jcmVhdGVIdWIodGhpcy4kc2NvcGUuaHViKS50aGVuKGZ1bmN0aW9uKGh1Yil7XG4gICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuSElERV9MT0FESU5HKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGh1Yik7XG4gICAgICAgICAgICB0aGlzLiRzdGF0ZS5nbygnaHViJywge2h1YklkOiBodWIuaWR9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2FkZEh1Yk1vZGFsJyxbXSlcbiAgICAuZGlyZWN0aXZlKCdhZGRIdWJNb2RhbCcsIGZ1bmN0aW9uKCRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDonRScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgICAgICAgICAgIG5ldyBBZGRIdWJNb2RhbERpcmVjdGl2ZSgkc2NvcGUsICRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2NvcGU6ZmFsc2UsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0aWFscy9odWJzL2FkZEh1Yk1vZGFsL2FkZEh1Yk1vZGFsLmh0bWxcIlxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgSHViSW5mb0RpcmVjdGl2ZSA9IEJhc2VEaXJlY3RpdmUuZXh0ZW5kKHtcbiAgICBodWJNb2RlbDogbnVsbCxcbiAgICBub3RpZmljYXRpb25zOiBudWxsLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFVzZXJNb2RlbCwgTm90aWZpY2F0aW9ucywgSHViTW9kZWwpe1xuICAgICAgICB0aGlzLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgdGhpcy51c2VyTW9kZWwgPSBVc2VyTW9kZWw7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnM7XG4gICAgICAgIHRoaXMuaHViTW9kZWwgPSBIdWJNb2RlbDtcbiAgICB9LFxuXG4gICAgZGVmaW5lTGlzdGVuZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBkZWZpbmVTY29wZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IHRoaXMudXNlck1vZGVsLmN1cnJlbnRVc2VyO1xuICAgICAgICB0aGlzLmh1YiA9IHRoaXMuaHViTW9kZWwuaHViO1xuICAgIH0sXG5cbiAgICBkZXN0cm95OiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH1cblxuXG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2h1YkluZm8nLFtdKVxuICAgIC5kaXJlY3RpdmUoJ2h1YkluZm8nLCBmdW5jdGlvbigkc3RhdGUsIFVzZXJNb2RlbCwgTm90aWZpY2F0aW9ucywgSHViTW9kZWwpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6J0UnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgICAgICAgICBuZXcgSHViSW5mb0RpcmVjdGl2ZSgkc2NvcGUsICRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2NvcGU6ZmFsc2UsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0aWFscy9odWJzL2h1YkluZm8vaHViSW5mby5odG1sXCJcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsInZhciBIdWJQYWdlQ29udHJvbGxlciA9IEJhc2VDb250cm9sbGVyLmV4dGVuZCh7XG5cbiAgICBpbml0aWFsaXplOmZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBOb3RpZmljYXRpb25zLCBVc2VyTW9kZWwsIEh1Yk1vZGVsKXtcbiAgICAgICAgdGhpcy51c2VyTW9kZWwgPSBVc2VyTW9kZWw7XG4gICAgICAgIHRoaXMuaHViTW9kZWwgPSBIdWJNb2RlbDtcbiAgICAgICAgdGhpcy4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnM7XG4gICAgfSxcblxuICAgIGRlZmluZUxpc3RlbmVyczpmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBkZWZpbmVTY29wZTpmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLiRzY29wZS5odWIgPSB0aGlzLmh1Yk1vZGVsLmh1YjtcbiAgICAgICAgdGhpcy4kc2NvcGUuY3VycmVudFVzZXIgPSB0aGlzLnVzZXJNb2RlbC5jdXJyZW50VXNlcjtcbiAgICAgICAgdGhpcy4kc2NvcGUub3BlbkFkZFNvbmdNb2RhbCA9IHRoaXMub3BlbkFkZFNvbmdNb2RhbC5iaW5kKHRoaXMpO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKCd1bC50YWJzJykudGFicygpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuQlJBTkRfQ0hBTkdFLCB0aGlzLiRzY29wZS5odWIuZ2V0KCduYW1lJykpO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuSElERV9MT0FESU5HKTtcbiAgICB9LFxuXG4gICAgZGVzdHJveTpmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBvcGVuQWRkU29uZ01vZGFsOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuT1BFTl9BRERfU09OR19NT0RBTCk7XG4gICAgfVxuXG5cblxufSk7XG5cbkh1YlBhZ2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnTm90aWZpY2F0aW9ucycsICdVc2VyTW9kZWwnLCAnSHViTW9kZWwnXTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEh1Ykxpc3REaXJlY3RpdmUgPSBCYXNlRGlyZWN0aXZlLmV4dGVuZCh7XG4gICAgaHViTW9kZWw6IG51bGwsXG4gICAgbm90aWZpY2F0aW9uczogbnVsbCxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsKXtcbiAgICAgICAgdGhpcy4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgIHRoaXMudXNlck1vZGVsID0gVXNlck1vZGVsO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zO1xuICAgICAgICB0aGlzLmh1Yk1vZGVsID0gSHViTW9kZWw7XG4gICAgfSxcblxuICAgIGRlZmluZUxpc3RlbmVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcblxuICAgIH0sXG5cbiAgICBkZWZpbmVTY29wZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy4kc2NvcGUuaHVicyA9IHRoaXMuaHViTW9kZWwuaHVicztcbiAgICAgICAgY29uc29sZS5sb2codGhpcy4kc2NvcGUuaHVicyk7XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuXG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2h1Ykxpc3QnLFtdKVxuICAgIC5kaXJlY3RpdmUoJ2h1Ykxpc3QnLCBmdW5jdGlvbigkc3RhdGUsIFVzZXJNb2RlbCwgTm90aWZpY2F0aW9ucywgSHViTW9kZWwpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6J0UnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgICAgICAgICBuZXcgSHViTGlzdERpcmVjdGl2ZSgkc2NvcGUsICRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwicGFydGlhbHMvaHVicy9odWJMaXN0L2h1Ykxpc3QuaHRtbFwiXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBIdWJMaXN0SXRlbURpcmVjdGl2ZSA9IEJhc2VEaXJlY3RpdmUuZXh0ZW5kKHtcbiAgICBodWJNb2RlbDogbnVsbCxcbiAgICBub3RpZmljYXRpb25zOiBudWxsLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFVzZXJNb2RlbCwgTm90aWZpY2F0aW9ucywgSHViTW9kZWwpe1xuICAgICAgICB0aGlzLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgdGhpcy51c2VyTW9kZWwgPSBVc2VyTW9kZWw7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnM7XG4gICAgICAgIHRoaXMuaHViTW9kZWwgPSBIdWJNb2RlbDtcbiAgICB9LFxuXG4gICAgZGVmaW5lTGlzdGVuZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBkZWZpbmVTY29wZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG5cbn0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnaHViTGlzdEl0ZW0nLFtdKVxuICAgIC5kaXJlY3RpdmUoJ2h1Ykxpc3RJdGVtJywgZnVuY3Rpb24oJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OidFJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgICAgICAgICAgICAgbmV3IEh1Ykxpc3RJdGVtRGlyZWN0aXZlKCRzY29wZSwgJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzY29wZTpmYWxzZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInBhcnRpYWxzL2h1YnMvaHViTGlzdC9odWJMaXN0SXRlbS5odG1sXCJcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsIi8vVXNlcnMgQ29udHJvbGxlclxudmFyIEh1YnNQYWdlQ29udHJvbGxlciA9IEJhc2VDb250cm9sbGVyLmV4dGVuZCh7XG5cbiAgICBpbml0aWFsaXplOmZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBOb3RpZmljYXRpb25zLCBVc2VyTW9kZWwsIEh1Yk1vZGVsKXtcbiAgICAgICAgdGhpcy51c2VyTW9kZWwgPSBVc2VyTW9kZWw7XG4gICAgICAgIHRoaXMuaHViTW9kZWwgPSBIdWJNb2RlbDtcbiAgICAgICAgdGhpcy4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnM7XG4gICAgfSxcblxuICAgIGRlZmluZUxpc3RlbmVyczpmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBkZWZpbmVTY29wZTpmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLiRzY29wZS5jdXJyZW50VXNlciA9IHRoaXMudXNlck1vZGVsLmN1cnJlbnRVc2VyO1xuICAgICAgICB0aGlzLiRzY29wZS5vcGVuQWRkSHViTW9kYWwgPSB0aGlzLm9wZW5BZGRIdWJNb2RhbC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5ub3RpZnkobW9kZWxzLmV2ZW50cy5CUkFORF9DSEFOR0UsIFwiSHVic1wiKTtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5vdGlmeShtb2RlbHMuZXZlbnRzLkhJREVfTE9BRElORyk7XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6ZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuXG4gICAgb3BlbkFkZEh1Yk1vZGFsOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuT1BFTl9BRERfSFVCX01PREFMKTtcbiAgICB9XG59KTtcblxuSHVic1BhZ2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnTm90aWZpY2F0aW9ucycsICdVc2VyTW9kZWwnLCAnSHViTW9kZWwnXTtcbiIsIid1c2Ugc3RyaWN0Jztcbm5hbWVzcGFjZSgnbW9kZWxzLmV2ZW50cycpLlBMQVkgPSBcIkFjdGl2aXR5TW9kZWwuUExBWVwiO1xubmFtZXNwYWNlKCdtb2RlbHMuZXZlbnRzJykuU1RPUCA9IFwiQWN0aXZpdHlNb2RlbC5TVE9QXCI7XG5uYW1lc3BhY2UoJ21vZGVscy5ldmVudHMnKS5ORVhUX1NPTkcgPSBcIkFjdGl2aXR5TW9kZWwuTkVYVF9TT05HXCI7XG5uYW1lc3BhY2UoJ21vZGVscy5ldmVudHMnKS5TT05HU19MT0FERUQgPSBcIkFjdGl2aXR5TW9kZWwuU09OR1NfTE9BREVEXCI7XG5cbnZhciBZb3VUdWJlUGxheWVyRGlyZWN0aXZlID0gQmFzZURpcmVjdGl2ZS5leHRlbmQoe1xuICAgIG5vdGlmaWNhdGlvbnM6IG51bGwsXG4gICAgaHViTW9kZWw6IG51bGwsXG4gICAgcGxheWVyOiBudWxsLFxuICAgIHN0YXRlOiBudWxsLFxuXG5cbiAgICBpbml0OiBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsIE5vdGlmaWNhdGlvbnMpe1xuICAgICAgICB0aGlzLiRyb290U2NvcGUgPSAkcm9vdFNjb3BlO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBOb3RpZmljYXRpb25zO1xuICAgICAgICB0aGlzLl9zdXBlcigkc2NvcGUpO1xuICAgIH0sXG5cbiAgICBkZWZpbmVMaXN0ZW5lcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIGRlZmluZVNjb3BlOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLmluaXRZb3VUdWJlUGxheWVyKCk7XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIGluaXRZb3VUdWJlUGxheWVyOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBZVC5QbGF5ZXIoJ3BsYXllcicsIHtcbiAgICAgICAgICAgIGhlaWdodDogJzM5MCcsXG4gICAgICAgICAgICB3aWR0aDogJzY0MCcsXG4gICAgICAgICAgICB2aWRlb0lkOiAnTTdsYzFVVmYtVkUnLFxuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgJ29uUmVhZHknOiB0aGlzLm9uUGxheWVyUmVhZHksXG4gICAgICAgICAgICAgICAgJ29uU3RhdGVDaGFuZ2UnOiB0aGlzLm9uUGxheWVyU3RhdGVDaGFuZ2UuYmluZCh0aGlzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgb25QbGF5ZXJSZWFkeTogZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBldmVudC50YXJnZXQucGxheVZpZGVvKCk7XG4gICAgfSxcblxuICAgIG9uUGxheWVyU3RhdGVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcFZpZGVvKCk7XG4gICAgfVxuXG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ3lvdXR1YmVQbGF5ZXInLFtdKVxuICAgIC5kaXJlY3RpdmUoJ3lvdXR1YmVQbGF5ZXInLCBmdW5jdGlvbigkcm9vdFNjb3BlLCBOb3RpZmljYXRpb25zKXtcblx0cmV0dXJuIHtcblx0ICAgIHJlc3RyaWN0OidFJyxcblx0ICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSl7XG5cdFx0bmV3IFlvdVR1YmVQbGF5ZXJEaXJlY3RpdmUoJHNjb3BlLCAkcm9vdFNjb3BlLCBOb3RpZmljYXRpb25zKTtcblx0ICAgIH0sXG5cdCAgICBzY29wZTpmYWxzZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInBhcnRpYWxzL3BsYXllci9tb2R1bGVzL3lvdXR1YmVQbGF5ZXIuaHRtbFwiXG5cdH07XG4gICAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm5hbWVzcGFjZSgnbW9kZWxzLmV2ZW50cycpLk9QRU5fQUREX1NPTkdfTU9EQUwgPSBcIkFjdGl2aXR5TW9kZWwuT1BFTl9BRERfU09OR19NT0RBTFwiO1xuXG52YXIgQWRkU29uZ01vZGFsRGlyZWN0aXZlID0gQmFzZURpcmVjdGl2ZS5leHRlbmQoe1xuICAgIGh1Yk1vZGVsOiBudWxsLFxuICAgIHNvbmdNb2RlbDogbnVsbCxcbiAgICBub3RpZmljYXRpb25zOiBudWxsLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFVzZXJNb2RlbCwgTm90aWZpY2F0aW9ucywgSHViTW9kZWwsIFNvbmdNb2RlbCl7XG4gICAgICAgIHRoaXMuJHN0YXRlID0gJHN0YXRlO1xuICAgICAgICB0aGlzLnVzZXJNb2RlbCA9IFVzZXJNb2RlbDtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucztcbiAgICAgICAgdGhpcy5odWJNb2RlbCA9IEh1Yk1vZGVsO1xuICAgICAgICB0aGlzLnNvbmdNb2RlbCA9IFNvbmdNb2RlbDtcbiAgICB9LFxuXG4gICAgZGVmaW5lTGlzdGVuZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLm9uT3Blbk1vZGFsID0gdGhpcy5vbk9wZW5Nb2RhbC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihtb2RlbHMuZXZlbnRzLk9QRU5fQUREX1NPTkdfTU9EQUwsIHRoaXMub25PcGVuTW9kYWwpO1xuICAgIH0sXG5cbiAgICBkZWZpbmVTY29wZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy4kc2NvcGUuZmluZFNvbmdzID0gdGhpcy5maW5kU29uZ3MuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy4kc2NvcGUuc2VhcmNoUGFyYW1zID0ge307XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5yZW1vdmVFdmVudExpc3RlbmVyKG1vZGVscy5ldmVudHMuT1BFTl9BRERfU09OR19NT0RBTCwgdGhpcy5vbk9wZW5Nb2RhbCk7XG4gICAgfSxcblxuICAgIG9uT3Blbk1vZGFsOiBmdW5jdGlvbigpe1xuICAgICAgICAkKCcjYWRkU29uZ01vZGFsJykub3Blbk1vZGFsKCk7XG4gICAgICAgICQoJyNxdWVyeUlucHV0JykuZm9jdXMoKTtcbiAgICB9LFxuXG4gICAgZmluZFNvbmdzOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnNvbmdNb2RlbC5maW5kU29uZ3ModGhpcy4kc2NvcGUuc2VhcmNoUGFyYW1zKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpe1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ2FkZFNvbmdNb2RhbCcsW10pXG4gICAgLmRpcmVjdGl2ZSgnYWRkU29uZ01vZGFsJywgZnVuY3Rpb24oJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsLCBTb25nTW9kZWwpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6J0UnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgICAgICAgICBuZXcgQWRkU29uZ01vZGFsRGlyZWN0aXZlKCRzY29wZSwgJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsLCBTb25nTW9kZWwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwicGFydGlhbHMvc29uZ3MvYWRkU29uZ01vZGFsL2FkZFNvbmdNb2RhbC5odG1sXCJcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFNvbmdMaXN0RGlyZWN0aXZlID0gQmFzZURpcmVjdGl2ZS5leHRlbmQoe1xuICAgIGh1Yk1vZGVsOiBudWxsLFxuICAgIHNvbmdNb2RlbDogbnVsbCxcbiAgICBub3RpZmljYXRpb25zOiBudWxsLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFVzZXJNb2RlbCwgTm90aWZpY2F0aW9ucywgSHViTW9kZWwsIFNvbmdNb2RlbCl7XG4gICAgICAgIHRoaXMuJHN0YXRlID0gJHN0YXRlO1xuICAgICAgICB0aGlzLnVzZXJNb2RlbCA9IFVzZXJNb2RlbDtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucztcbiAgICAgICAgdGhpcy5odWJNb2RlbCA9IEh1Yk1vZGVsO1xuICAgICAgICB0aGlzLnNvbmdNb2RlbCA9IFNvbmdNb2RlbDtcbiAgICB9LFxuXG4gICAgZGVmaW5lTGlzdGVuZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLm9uU29uZ3NGb3VuZCA9IHRoaXMub25Tb25nc0ZvdW5kLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5hZGRFdmVudExpc3RlbmVyKG1vZGVscy5ldmVudHMuU09OR1NfRk9VTkQsIHRoaXMub25Tb25nc0ZvdW5kKTtcbiAgICB9LFxuXG4gICAgZGVmaW5lU2NvcGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuJHNjb3BlLmh1YiA9IHRoaXMuaHViTW9kZWwuaHViO1xuICAgICAgICB0aGlzLiRzY29wZS55b3V0dWJlU29uZ3MgPSB0aGlzLnNvbmdNb2RlbC5mb3VuZFlvdXR1YmVTb25ncztcbiAgICB9LFxuXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLnJlbW92ZUV2ZW50TGlzdGVuZXIobW9kZWxzLmV2ZW50cy5TT05HU19GT1VORCwgdGhpcy5vblNvbmdzRm91bmQpO1xuICAgIH0sXG5cbiAgICBvblNvbmdzRm91bmQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHNjb3BlLnNvbmdzID0gdGhpcy5zb25nTW9kZWwuZm91bmRTb25ncztcbiAgICAgICAgY29uc29sZS5sb2codGhpcy4kc2NvcGUuc29uZ3MpO1xuICAgIH1cblxuXG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ3NvbmdMaXN0JyxbXSlcbiAgICAuZGlyZWN0aXZlKCdzb25nTGlzdCcsIGZ1bmN0aW9uKCRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCwgU29uZ01vZGVsKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OidFJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgICAgICAgICAgICAgbmV3IFNvbmdMaXN0RGlyZWN0aXZlKCRzY29wZSwgJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsLCBTb25nTW9kZWwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwicGFydGlhbHMvc29uZ3Mvc29uZ0xpc3Qvc29uZ0xpc3QuaHRtbFwiXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTb25nTGlzdEl0ZW1EaXJlY3RpdmUgPSBCYXNlRGlyZWN0aXZlLmV4dGVuZCh7XG4gICAgaHViTW9kZWw6IG51bGwsXG4gICAgc29uZ01vZGVsOiBudWxsLFxuICAgIG5vdGlmaWNhdGlvbnM6IG51bGwsXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCl7XG4gICAgICAgIHRoaXMuJHN0YXRlID0gJHN0YXRlO1xuICAgICAgICB0aGlzLnVzZXJNb2RlbCA9IFVzZXJNb2RlbDtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucztcbiAgICAgICAgdGhpcy5odWJNb2RlbCA9IEh1Yk1vZGVsO1xuICAgIH0sXG5cbiAgICBkZWZpbmVMaXN0ZW5lcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIGRlZmluZVNjb3BlOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLiRzY29wZS5hZGRTb25nID0gdGhpcy5hZGRTb25nLmJpbmQodGhpcyk7XG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy4kc2NvcGUuc29uZyk7XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIGFkZFNvbmc6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYWRkXCIpO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuU0hPV19MT0FESU5HKTtcbiAgICAgICAgdGhpcy5odWJNb2RlbC5hZGRTb25nVG9QbGF5bGlzdCh0aGlzLiRzY29wZS5zb25nKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpe1xuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5vdGlmeShtb2RlbHMuZXZlbnRzLkhJREVfTE9BRElORyk7XG4gICAgICAgICAgICBNYXRlcmlhbGl6ZS50b2FzdCgnU29uZyBhZGRlZCEnLCAyMDAwLCAnJyk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuXG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ3NvbmdMaXN0SXRlbScsW10pXG4gICAgLmRpcmVjdGl2ZSgnc29uZ0xpc3RJdGVtJywgZnVuY3Rpb24oJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMsIEh1Yk1vZGVsKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OidFJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgICAgICAgICAgICAgbmV3IFNvbmdMaXN0SXRlbURpcmVjdGl2ZSgkc2NvcGUsICRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2NvcGU6ZmFsc2UsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0aWFscy9zb25ncy9zb25nTGlzdC9zb25nTGlzdEl0ZW0uaHRtbFwiXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm5hbWVzcGFjZSgnbW9kZWxzLmV2ZW50cycpLk9QRU5fTE9HSU5fTU9EQUwgPSBcIkFjdGl2aXR5TW9kZWwuT1BFTl9MT0dJTl9NT0RBTFwiO1xuXG52YXIgTG9naW5Nb2RhbERpcmVjdGl2ZSA9IEJhc2VEaXJlY3RpdmUuZXh0ZW5kKHtcbiAgICB1c2VyTW9kYWw6IG51bGwsXG4gICAgbm90aWZpY2F0aW9uczogbnVsbCxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMpe1xuICAgICAgICB0aGlzLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgdGhpcy51c2VyTW9kZWwgPSBVc2VyTW9kZWw7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnM7XG4gICAgfSxcblxuICAgIGRlZmluZUxpc3RlbmVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5vbk9wZW5Nb2RhbCA9IHRoaXMub25PcGVuTW9kYWwuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLmFkZEV2ZW50TGlzdGVuZXIobW9kZWxzLmV2ZW50cy5PUEVOX0xPR0lOX01PREFMLCB0aGlzLm9uT3Blbk1vZGFsKTtcbiAgICB9LFxuXG4gICAgZGVmaW5lU2NvcGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuJHNjb3BlLmxvZ2luID0gdGhpcy5sb2dpbi5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLiRzY29wZS5zaWduVXAgPSB0aGlzLnNpZ25VcC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLiRzY29wZS51c2VyID0ge307XG4gICAgICAgIHRoaXMuJHNjb3BlLmlzTG9naW4gPSB0cnVlO1xuICAgIH0sXG5cbiAgICBvbk9wZW5Nb2RhbDogZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnI2xvZ2luTW9kYWwnKS5vcGVuTW9kYWwoKTtcbiAgICB9LFxuXG4gICAgbG9naW46IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5ub3RpZnkobW9kZWxzLmV2ZW50cy5TSE9XX0xPQURJTkcpO1xuICAgICAgICB0aGlzLnVzZXJNb2RlbC5sb2dpbih0aGlzLiRzY29wZS51c2VyLnVzZXJuYW1lLCB0aGlzLiRzY29wZS51c2VyLnBhc3N3b3JkKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5vdGlmeShtb2RlbHMuZXZlbnRzLkhJREVfTE9BRElORyk7XG4gICAgICAgICAgICAkKCcjbG9naW5Nb2RhbCcpLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuSElERV9MT0FESU5HKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLmVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLmVycm9yTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICAgICAgICB0aGlzLiRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgc2lnblVwOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuU0hPV19MT0FESU5HKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy4kc2NvcGUudXNlcik7XG4gICAgICAgIHRoaXMudXNlck1vZGVsLnNpZ25VcCh0aGlzLiRzY29wZS51c2VyLnVzZXJuYW1lLCB0aGlzLiRzY29wZS51c2VyLnBhc3N3b3JkKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5vdGlmeShtb2RlbHMuZXZlbnRzLkhJREVfTE9BRElORyk7XG4gICAgICAgICAgICAkKCcjbG9naW5Nb2RhbCcpLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuSElERV9MT0FESU5HKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLmVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLmVycm9yTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICAgICAgICB0aGlzLiRzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cblxufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdsb2dpbk1vZGFsJyxbXSlcbiAgICAuZGlyZWN0aXZlKCdsb2dpbk1vZGFsJywgZnVuY3Rpb24oJHN0YXRlLCBVc2VyTW9kZWwsIE5vdGlmaWNhdGlvbnMpe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6J0UnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICAgICAgICAgICBuZXcgTG9naW5Nb2RhbERpcmVjdGl2ZSgkc2NvcGUsICRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzY29wZTpmYWxzZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInBhcnRpYWxzL3VzZXJzL2xvZ2luTW9kYWwvbG9naW5Nb2RhbC5odG1sXCJcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFVzZXJMaXN0RGlyZWN0aXZlID0gQmFzZURpcmVjdGl2ZS5leHRlbmQoe1xuICAgIGh1Yk1vZGVsOiBudWxsLFxuICAgIG5vdGlmaWNhdGlvbnM6IG51bGwsXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCl7XG4gICAgICAgIHRoaXMuJHN0YXRlID0gJHN0YXRlO1xuICAgICAgICB0aGlzLnVzZXJNb2RlbCA9IFVzZXJNb2RlbDtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucztcbiAgICAgICAgdGhpcy5odWJNb2RlbCA9IEh1Yk1vZGVsO1xuICAgIH0sXG5cbiAgICBkZWZpbmVMaXN0ZW5lcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG5cbiAgICB9LFxuXG4gICAgZGVmaW5lU2NvcGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuJHNjb3BlLmh1YnMgPSB0aGlzLmh1Yk1vZGVsLmh1YnM7XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuXG59KTtcblxuYW5ndWxhci5tb2R1bGUoJ3VzZXJMaXN0JyxbXSlcbiAgICAuZGlyZWN0aXZlKCd1c2VyTGlzdCcsIGZ1bmN0aW9uKCRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDonRScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgICAgICAgICAgIG5ldyBVc2VyTGlzdERpcmVjdGl2ZSgkc2NvcGUsICRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwicGFydGlhbHMvdXNlcnMvdXNlckxpc3QvdXNlckxpc3QuaHRtbFwiXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBVc2VyTGlzdEl0ZW1EaXJlY3RpdmUgPSBCYXNlRGlyZWN0aXZlLmV4dGVuZCh7XG4gICAgaHViTW9kZWw6IG51bGwsXG4gICAgdXNlck1vZGVsOiBudWxsLFxuICAgIG5vdGlmaWNhdGlvbnM6IG51bGwsXG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCl7XG4gICAgICAgIHRoaXMuJHN0YXRlID0gJHN0YXRlO1xuICAgICAgICB0aGlzLnVzZXJNb2RlbCA9IFVzZXJNb2RlbDtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucztcbiAgICAgICAgdGhpcy5odWJNb2RlbCA9IEh1Yk1vZGVsO1xuICAgIH0sXG5cbiAgICBkZWZpbmVMaXN0ZW5lcnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIGRlZmluZVNjb3BlOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBkZXN0cm95OiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cblxufSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1c2VyTGlzdEl0ZW0nLFtdKVxuICAgIC5kaXJlY3RpdmUoJ3VzZXJMaXN0SXRlbScsIGZ1bmN0aW9uKCRzdGF0ZSwgVXNlck1vZGVsLCBOb3RpZmljYXRpb25zLCBIdWJNb2RlbCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDonRScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgICAgICAgICAgIG5ldyBVc2VyTGlzdEl0ZW1EaXJlY3RpdmUoJHNjb3BlLCAkc3RhdGUsIFVzZXJNb2RlbCwgTm90aWZpY2F0aW9ucywgSHViTW9kZWwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNjb3BlOmZhbHNlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwicGFydGlhbHMvdXNlcnMvdXNlckxpc3QvdXNlckxpc3RJdGVtLmh0bWxcIlxuICAgICAgICB9O1xuICAgIH0pO1xuIiwidmFyIFVzZXJQYWdlQ29udHJvbGxlciA9IEJhc2VDb250cm9sbGVyLmV4dGVuZCh7XG5cbiAgICBpbml0aWFsaXplOmZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBOb3RpZmljYXRpb25zLCBVc2VyTW9kZWwsIEh1Yk1vZGVsKXtcbiAgICAgICAgdGhpcy51c2VyTW9kZWwgPSBVc2VyTW9kZWw7XG4gICAgICAgIHRoaXMuaHViTW9kZWwgPSBIdWJNb2RlbDtcbiAgICAgICAgdGhpcy4kc3RhdGUgPSAkc3RhdGU7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IE5vdGlmaWNhdGlvbnM7XG4gICAgfSxcblxuICAgIGRlZmluZUxpc3RlbmVyczpmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBkZWZpbmVTY29wZTpmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubm90aWZ5KG1vZGVscy5ldmVudHMuQlJBTkRfQ0hBTkdFLCBcIlVzZXJzXCIpO1xuICAgICAgICB0aGlzLiRzY29wZS51c2VyID0gdGhpcy51c2VyTW9kZWwudXNlcjtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5vdGlmeShtb2RlbHMuZXZlbnRzLkhJREVfTE9BRElORyk7XG4gICAgfSxcblxuICAgIGRlc3Ryb3k6ZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9XG59KTtcblxuVXNlclBhZ2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnTm90aWZpY2F0aW9ucycsICdVc2VyTW9kZWwnLCAnSHViTW9kZWwnXTtcbiIsInZhciBVc2Vyc1BhZ2VDb250cm9sbGVyID0gQmFzZUNvbnRyb2xsZXIuZXh0ZW5kKHtcblxuICAgIGluaXRpYWxpemU6ZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIE5vdGlmaWNhdGlvbnMsIFVzZXJNb2RlbCwgSHViTW9kZWwpe1xuICAgICAgICB0aGlzLnVzZXJNb2RlbCA9IFVzZXJNb2RlbDtcbiAgICAgICAgdGhpcy5odWJNb2RlbCA9IEh1Yk1vZGVsO1xuICAgICAgICB0aGlzLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gTm90aWZpY2F0aW9ucztcbiAgICB9LFxuXG4gICAgZGVmaW5lTGlzdGVuZXJzOmZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIGRlZmluZVNjb3BlOmZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5ub3RpZnkobW9kZWxzLmV2ZW50cy5CUkFORF9DSEFOR0UsIFwiVXNlcnNcIik7XG4gICAgICAgIHRoaXMuJHNjb3BlLnVzZXJzID0gdGhpcy51c2VyTW9kZWwudXNlcnM7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5ub3RpZnkobW9kZWxzLmV2ZW50cy5ISURFX0xPQURJTkcpO1xuICAgIH0sXG5cbiAgICBkZXN0cm95OmZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfVxufSk7XG5cblVzZXJzUGFnZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICdOb3RpZmljYXRpb25zJywgJ1VzZXJNb2RlbCcsICdIdWJNb2RlbCddO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9