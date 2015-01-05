var FeedBackModalCtrl = function($scope, $modalInstance){

    $scope.modal = $modalInstance;
    $scope.feedback = {};
    $scope.feedback.comment = "";


    $scope.dismissModal = function(){
        $scope.modal.dismiss();
    };

    $scope.createFeedback = function(){
        var feedback = new Parse.Object("Feedback");
        feedback.set("platform", "web");
        feedback.set("comment", $scope.feedback.comment);
        feedback.save({
            success: function(object){
                $scope.modal.dismiss();
            },
            error: function(object, error){
                $scope.modal.dismiss();
            }
        });
    };
};
