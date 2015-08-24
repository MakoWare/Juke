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
    .directive('loginModal', function($state, UserModel, Notifications){
        return {
            restrict:'E',
            link: function($scope){
                new LoginModalDirective($scope, $state, UserModel, Notifications);
            },
            scope:false,
            templateUrl: "partials/users/loginModal/loginModal.html"
        };
    });
