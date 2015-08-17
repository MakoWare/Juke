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
    },

    destroy: function(){
        this._super();
        this.notifications.removeEventListener(models.events.OPEN_ADD_HUB_MODAL, this.onOpenModal);
    },

    onOpenModal: function(){
        $('#modal1').openModal();
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
