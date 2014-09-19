var HubModalCtrl = function($scope, $modalInstance, HubsModel){

    $scope.init = function(){
        $scope.modal = $modalInstance;
        $scope.hubsModel = HubsModel;

        $scope.hub = {};
        $scope.hub.name = "";
        $scope.hub.password = "";
        $scope.hub.capabilities = {};
        $scope.all = true;
        $scope.hub.capabilities.youtube = false;
        $scope.hub.capabilities.spotify = false;
        $scope.hub.capabilities.local = false;

        $(document).on('click','#createHubButton', this.createNewHub.bind(this));
        $(document).on('click','#closeModalButton',function(){
            $scope.modal.close();
        });

    },


    $scope.createNewHub = function(){
        var hub = $scope.hub;

        if($scope.all){
            hub.capabilities.youtube = true;
            hub.capabilities.spotify = true;
        }

        $scope.modal.close();
        $scope.hubsModel.createHub(hub.name, hub.password, hub.capabilities);
    },

    $scope.init();
};
