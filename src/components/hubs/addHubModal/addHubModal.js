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
    .directive('addHubModal', function($state, UserModel, Notifications, HubModel){
        return {
            restrict:'E',
            link: function($scope){
                new AddHubModalDirective($scope, $state, UserModel, Notifications, HubModel);
            },
            scope:false,
            templateUrl: "partials/hubs/addHubModal/addHubModal.html"
        };
    });
