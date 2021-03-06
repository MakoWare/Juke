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
