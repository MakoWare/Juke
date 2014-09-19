var HubModalCtrl = function($scope, $modalInstance, HubsModel){
    console.log(HubsModel);

    $scope.init = function(){
        $scope.modal = $modalInstance;
        $scope.hubsModel = HubsModel;

        $scope.hub = {};
        $scope.hub.name = "";
        $scope.hub.password = "";
        $scope.hub.capabilities = {};
        $scope.hub.capabilities.all = true;
        $scope.hub.capabilities.youtube = false;
        $scope.hub.capabilities.spotify = false;

        $(document).on('click','#createHubButton', this.createNewHub.bind(this));

    },

    $scope.createNewHub = function(){
        var hub = $scope.hub;
        $scope.modal.close();
        $scope.hubsModel.createHub(hub.name, hub.password, hub.capabilities);
    },

    $scope.init();

};
