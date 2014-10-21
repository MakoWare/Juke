var UserCtrl = BaseController.extend({
    notifications: null,
    hubsModel: null,
    userModel: null,

    init:function($scope, $location,  HubsModel, UsersModel, Notifications){
        this.notifications = Notifications;
        this.hubsModel = HubsModel;
        this.userModel = UsersModel;
        this.location = $location;
        this._super($scope);
    },

    defineScope:function(){
        var username = this.location.url().split("/")[this.location.url().split("/").length - 1];
        if(this.userModel.currentUser && this.userModel.currentUser.get('username') == username){
            this.userModel.viewingUser = this.userModel.currentUser;
            this.$scope.viewingUser = this.userModel.currentUser;
        } else {
            this.userModel.getUserByUsername(username);
        }

    },

    defineListeners:function(){
        this.notifications.addEventListener(juke.events.FOUND_USER_BY_USERNAME, this.handleFoundViewingUser.bind(this));
    },

    handleFoundViewingUser:function(){
        this.$scope.viewingUser = this.userModel.viewingUser;
        this.$scope.$apply();
    },

    destroy:function(){

    }

});

UserCtrl.$inject = ['$scope', '$location', 'HubsModel', 'UsersModel', 'Notifications'];
